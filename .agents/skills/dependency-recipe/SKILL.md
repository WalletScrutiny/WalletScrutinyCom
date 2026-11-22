---
name: dependency-recipe
description: Write a rebuild recipe for one source repository whose packages WalletScrutiny wallets ship, so the dependency rebuilder (external/dep_rebuilder) can build its releases from source and compare them with what the registry serves. Use when asked to reproduce a dependency, to work down the rebuilder's list of failed or unsupported packages, or to run the same job over many repositories.
---

# Writing a rebuild recipe

One repository per run. The result is a recipe file that the rebuilder accepts, the output of
its `try` command, and a short report. You never decide whether a package is reproduced: the
rebuilder compares the files. Your work is to find out how the publisher builds a release and
to write that down.

Read `external/dep_rebuilder/README.md`, section "Recipes", first. It has the fields and what
each phase may do. `recipes/babel.json` is the model.

## Rules

- **Never bring the published package into the build.** No `npm pack <name>`, no download of
  the registry tarball, no copy from `node_modules` of a published build of the package you are
  rebuilding. The `fetch` commands get dependencies, nothing else. A recipe that passes this
  way is worse than no recipe: it puts a false "reproduced" on wallet pages.
- **Every command is one the publisher's release runs**, or plain setup for it. Say in `notes`
  where the repository runs it (file and target or job). Do not edit build output to make it
  match: no `sed` over built files, no deleting of files that differ.
- **`build` and `pack` have no network.** If the build needs something from the network, it
  belongs in `fetch` and has to be a dependency, a toolchain or a cache.
- **A failure is a result.** If it does not reproduce, say which files differ and why. Do not
  loosen the recipe until something passes.
- Do not change the comparison, the sandbox or the tests to get a pass. If you think one of
  them is wrong, stop and report it.

## Procedure

1. **What is wanted.** `node index.mjs sync`, then list the versions wallets ship for this
   repository's packages, most shared first:
   `sqlite3 data/dep-rebuilder.db "SELECT version, COUNT(*), SUM(wallets) FROM candidates WHERE name LIKE '@scope/%' GROUP BY version ORDER BY 3 DESC"`.
   Start with the version most wallets ship.
2. **How the publisher builds.** Look, in this order, at:
   - the release workflow (`.github/workflows/*release*`, `*publish*`), the `Makefile`,
     `lerna.json`, changesets or release scripts: the commands between checkout and publish;
   - `package.json` at the root and in one package: `prepare`, `prepack`, `prepublishOnly`,
     `publishConfig`, `files`, `packageManager`;
   - what the registry says about the published version
     (`https://registry.npmjs.org/<name>/<version>`): `_nodeVersion`, `_npmVersion`, `gitHead`;
   - the published tarball's file list against the repository's directory: files that are in
     the tarball and not in git are what the build has to make.
3. **Write the recipe** in `external/dep_rebuilder/recipes/<id>.json`. Keep `fetch` to the
   install with the lockfile (`npm ci`, `yarn install --immutable`,
   `pnpm install --frozen-lockfile`). Set `image` only when the publisher's Node major does not
   build the release.
4. **Try it**, as an unprivileged user with rootless podman:
   `node index.mjs try recipes/<id>.json --version <version>`.
   Read every line of the output, not the count.
5. **When packages differ**, look at them. `try` keeps the rebuilt tarballs and names the
   directory. Unpack one next to the registry's and `diff -r`. Typical causes: the release sets
   a variable (`NODE_ENV`, a publish flag), runs a step before the pack that CI runs outside
   the package scripts, uses another Node major, or packs with another tool (`yarn pack` and
   `npm pack` choose files differently). Change the recipe and try again.
6. **Find the range.** Try the oldest and the newest version wallets ship. Where the build
   changes, set `versions` and write a second recipe (`<id>-<range>`) for the other range, if
   wallets ship enough of it.
7. **Stop** when every covered package reproduces, or when what is left differs for a reason
   you can name and no command of the release would change. Also stop after three changes that
   did not move the result, and report.
8. Run `npm test` in `external/dep_rebuilder` (the shipped recipes are checked there).

## Report

- The recipe's id and the range it covers.
- Per version tried: how many packages of how many reproduced, and how long the build took.
- What does not reproduce: the files and the reason, one line each. Put the same in the
  recipe's `notes`, short.
- What you did not try.
- How long the whole run took and, if you can read it, the tokens used. These numbers decide
  how many repositories get this treatment.

## Shipping

If your key is in `external/dep_rebuilder/config/recipe-authors.json`, publish the recipe as a
signed event (`node index.mjs publish <recipe>.json`, README "Recipes over Nostr") and post the
event id with the `try` output where the work was asked for. The rebuilder takes it within the
hour. Publish only a recipe whose `try` you ran yourself and whose every result you read: your
key is what stands behind it.

If your key is not on the list, the recipe and nothing else goes into one MR, with the `try`
output in the description. Do not add your own key to the list, and do not deploy.
