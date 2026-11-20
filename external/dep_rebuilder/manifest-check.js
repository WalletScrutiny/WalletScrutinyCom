// Runs inside the sandbox (npm-sandbox.sh passes this file to `node -e`), on the
// files of the repository, before anything is installed. Written for the oldest
// Node image (4) and without single quotes, which the shell quoting needs.
//
//   scripts <package dir>            prints 1 when the package has build scripts, else 0
//   sources <repository> <package>   prints the first dependency that does not come
//                                    from a registry or from the repository
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
  ["pnpm-workspace.yaml", "lerna.json"].forEach(function (f) { if (fs.existsSync(path.join(repo, f))) workspace = true; });
  // a workspace installs for all its members
  if (!hit && workspace) manifestsUnder(repo, 0, []).forEach(function (file) {
    if (hit) return;
    try { hit = manifestProblem(file); if (hit) hit = path.relative(repo, file) + ": " + hit; } catch (e) { /* not a manifest npm could install either */ }
  });
  [repo, pkg].forEach(function (dir) { if (!hit) hit = lockProblem(dir); });
  return hit;
}

var mode = process.argv[1];
if (mode === "scripts") {
  var s = {};
  try { s = readJson(path.join(process.argv[2], "package.json")).scripts || {}; } catch (e) { /* no manifest: nothing to run */ }
  console.log(["prepare", "prepack", "prepublish", "prepublishOnly", "build"].some(function (k) { return s[k]; }) ? 1 : 0);
} else if (mode === "sources") {
  var problem = sources(process.argv[2], process.argv[3]);
  if (problem) console.log(problem.replace(/\s+/g, " ").slice(0, 200));
}
