// Runs inside the sandbox (npm-sandbox.sh passes this file to `node -e`), on the
// files of the repository, before anything is installed. Written for the oldest
// Node image (4) and without single quotes, which the shell quoting needs.
//
//   scripts <package dir>            prints 1 when the package has build scripts, else 0
//   unhooked-build <package dir>     prints 1 when the package has a "build" script that
//                                    none of the scripts npm runs on publish calls, else 0
//   locate <repository> <package> <name>
//                                    prints nothing when the package directory holds the
//                                    package of that name; else the one directory of the
//                                    repository that does, or ? when there is none or several
//   sources <repository> <package>   prints the first dependency that does not come
//                                    from a registry or from the repository
//   workspace <repository> <package> prints 1 when the package is a member of a
//                                    workspace (a directory below a root that declares one), else 0
//
// Why "sources": npm clones a git dependency and runs its prepare script whatever
// --ignore-scripts says, and the install step has the network. So a dependency is
// accepted only in the forms known to be a registry version or a local path;
// everything else (git URLs, user/repo, hosted shortcuts, remote tarballs, forms
// this file does not know) is named, and the package is not installed.
var fs = require("fs"), path = require("path");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^﻿/, ""));
}

function fromRegistryOrRepository(spec) {
  if (typeof spec !== "string") return false;
  var s = spec.trim();
  if (/^(npm|workspace|file|link|portal|patch|catalog):/.test(s)) return true;
  if (/^[.~\/]/.test(s)) return true;      // a path
  return !/[:\/]/.test(s);                 // a version, range or tag
}

// every string under an overrides / resolutions object; "$name" refers to another dependency
function leaves(value, out) {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object") Object.keys(value).forEach(function (k) { leaves(value[k], out); });
  return out;
}

function manifestProblem(file) {
  var p = readJson(file), hit = null;
  ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"].forEach(function (field) {
    var deps = p[field];
    if (!deps || typeof deps !== "object") return;
    Object.keys(deps).forEach(function (name) {
      if (!hit && !fromRegistryOrRepository(deps[name])) hit = name + "@" + String(deps[name]);
    });
  });
  leaves([p.overrides, p.resolutions, p.pnpm && p.pnpm.overrides], []).forEach(function (spec) {
    if (!hit && !fromRegistryOrRepository(spec)) hit = "override " + spec;
  });
  return hit;
}

// A lockfile entry is fine when it resolves to a registry tarball or a local path.
// (A resolved value without a colon is a workspace member: a path in the repository.)
var NPM_LOCK = [/"resolved":\s*"(?!https?:\/\/[^"]*\.tgz"|file:|[^":]*")[^"]*"/, /"version":\s*"(?!file:|npm:)[^"]*[:\/][^"]*"/];
var LOCKS = {
  "package-lock.json": NPM_LOCK,
  "npm-shrinkwrap.json": NPM_LOCK,
  "yarn.lock": [/^\s+resolved "(?!https?:\/\/[^"#]*\.tgz[#"])[^"]*"/m],
  "pnpm-lock.yaml": [/^.*\btype: git\b.*$/m, /^.*\btarball: https?:\/\/(?:codeload\.)?(?:github\.com|gitlab\.com|bitbucket\.org)\/.*$/m]
};

function lockProblem(dir) {
  var hit = null;
  Object.keys(LOCKS).forEach(function (name) {
    var text;
    try { text = fs.readFileSync(path.join(dir, name), "utf8"); } catch (e) { return; }
    LOCKS[name].forEach(function (re) { var m = re.exec(text); if (!hit && m) hit = name + ": " + m[0].trim(); });
  });
  return hit;
}

function manifestsUnder(dir, depth, out) {
  if (depth > 8 || out.length > 5000) return out;
  var names;
  try { names = fs.readdirSync(dir); } catch (e) { return out; }
  names.forEach(function (name) {
    if (name === "node_modules" || name === ".git") return;
    var file = path.join(dir, name), stat;
    try { stat = fs.lstatSync(file); } catch (e) { return; }
    if (stat.isDirectory()) manifestsUnder(file, depth + 1, out);
    else if (name === "package.json" && stat.isFile()) out.push(file);
  });
  return out;
}

// what makes a repository root a workspace, besides "workspaces" in its package.json
var WORKSPACE_FILES = ["pnpm-workspace.yaml", "lerna.json"];

// A member of a workspace is built by the root (one install, often one build for all
// members), not in its own directory.
function workspaceMember(repo, pkg) {
  if (path.resolve(pkg) === path.resolve(repo)) return false;
  if (WORKSPACE_FILES.some(function (f) { return fs.existsSync(path.join(repo, f)); })) return true;
  try { return Boolean(readJson(path.join(repo, "package.json")).workspaces); } catch (e) { return false; }
}

function sources(repo, pkg) {
  var own = [path.join(repo, "package.json")], hit = null, workspace = false;
  if (path.resolve(pkg) !== path.resolve(repo)) own.push(path.join(pkg, "package.json"));
  own.forEach(function (file, i) {
    if (hit) return;
    try { hit = manifestProblem(file); if (readJson(file).workspaces) workspace = true; } catch (e) {
      // What cannot be checked is not installed. Only a repository root without a manifest, above the package, is fine.
      if (!(i === 0 && own.length > 1 && e.code === "ENOENT")) hit = path.relative(repo, file) + " cannot be read";
    }
  });
  WORKSPACE_FILES.forEach(function (f) { if (fs.existsSync(path.join(repo, f))) workspace = true; });
  // a workspace installs for all its members
  if (!hit && workspace) manifestsUnder(repo, 0, []).forEach(function (file) {
    if (hit) return;
    try { hit = manifestProblem(file); if (hit) hit = path.relative(repo, file) + ": " + hit; } catch (e) { /* not a manifest npm could install either */ }
  });
  [repo, pkg].forEach(function (dir) { if (!hit) hit = lockProblem(dir); });
  return hit;
}

var PUBLISH_HOOKS = ["prepare", "prepack", "prepublish", "prepublishOnly"];

function scriptsOf(dir) {
  try { return readJson(path.join(dir, "package.json")).scripts || {}; } catch (e) { return {}; /* no manifest: nothing to run */ }
}

// "build" is no lifecycle script: npm never runs it by itself. A hook that calls it
// names it as a word of its own ("npm run build", "yarn build"; not "build:types",
// "tsc --build") or is the same command.
function unhookedBuild(s) {
  if (typeof s.build !== "string" || !s.build.trim()) return false;
  return !PUBLISH_HOOKS.some(function (k) { return typeof s[k] === "string" && (/(^|\s)build($|\s)/.test(s[k]) || s[k].trim() === s.build.trim()); });
}

function nameAt(dir) {
  try { return readJson(path.join(dir, "package.json")).name; } catch (e) { return undefined; }
}

// repository.directory in the registry is optional and can be out of date. Without it the
// root is packed, which in a monorepo is another package.
function locate(repo, pkg, name) {
  if (nameAt(pkg) === name) return "";
  var dirs = manifestsUnder(repo, 0, []).map(function (file) { return path.dirname(file); }).filter(function (dir) { return nameAt(dir) === name; });
  if (dirs.length !== 1) return "?";
  var rel = path.relative(repo, dirs[0]) || ".";
  return /^[\w.@\/-]+$/.test(rel) ? rel : "?";   // a name with a line break would be read as a line of this step
}

var mode = process.argv[1];
if (mode === "scripts") {
  var s = scriptsOf(process.argv[2]);
  console.log(PUBLISH_HOOKS.concat("build").some(function (k) { return s[k]; }) ? "1" : "0");   // a string: console.log colours a number when FORCE_COLOR is set
} else if (mode === "unhooked-build") {
  console.log(unhookedBuild(scriptsOf(process.argv[2])) ? "1" : "0");
} else if (mode === "sources") {
  var problem = sources(process.argv[2], process.argv[3]);
  if (problem) console.log(problem.replace(/\s+/g, " ").slice(0, 200));
} else if (mode === "locate") {
  console.log(locate(process.argv[2], process.argv[3], process.argv[4]));
} else if (mode === "workspace") {
  console.log(workspaceMember(process.argv[2], process.argv[3]) ? "1" : "0");
}
