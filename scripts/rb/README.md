# Steps shared by the reproducible-build scripts

The build scripts the Automated Build Server runs are single `build.sh` files
attached to a verification event, capped at 48 KB and mostly at that cap. A
step every script needs therefore lives here once, and a script fetches it by
commit and checks its hash before running it.

## ws-depcheck: dependency check of the checkout

`ws-depcheck.sh` looks at the source a build script is about to compile and
answers, in the build recording and in `COMPARISON_RESULTS.yaml`:

- which lockfiles the release ships, and which manifests have none beside them
  (an unlocked `build.gradle` or `package.json` means the build resolves
  versions at build time, which a reproducible build should not),
- how many packages each lockfile pins and how many of them have a known
  advisory on OSV.dev, by severity, with the worst ten listed,
- whether the scan ran at all (`status: ok | no-lockfiles | scanner-failed`),
  so a missing block and a failed scan never look alike.

The scan is [osv-scanner](https://google.github.io/osv-scanner/), pulled by
digest, run in a container with the checkout mounted read-only and no
capabilities: it parses lockfiles and asks api.osv.dev, nothing of the
checkout runs. One checkout takes a few seconds; the first run also pulls the
image (~340 MB).

The step never changes the verdict and exits 0 whatever the scan found: the
build script's own exit code and `verdict` stay what the comparison decided.
The ABS reads only `script_version`, `verdict` and `notes` from the YAML and
publishes them; the `dependencies:` block travels in the recording and in the
YAML for whoever reads the build directory until the ABS learns to forward it.

### Calling it from a build script

Right after the checkout is at the release ref and before the build container
starts (the step needs the lockfiles, not the build output):

```bash
# Dependency check (scripts/rb/ws-depcheck.sh at a fixed commit, hash-checked). Never changes the verdict.
DEPCHECK_REV=<commit>; DEPCHECK_SHA=<sha256 of scripts/rb/ws-depcheck.sh at that commit>
if curl -fsSL --max-time 60 -o "${workspace}/ws-depcheck.sh" \
     "https://gitlab.com/walletscrutiny/walletScrutinyCom/-/raw/${DEPCHECK_REV}/scripts/rb/ws-depcheck.sh" \
   && echo "${DEPCHECK_SHA}  ${workspace}/ws-depcheck.sh" | sha256sum -c --quiet -; then
  bash "${workspace}/ws-depcheck.sh" --src "$SRC" --out "${workspace}/dependency-check" --yaml "${SCRIPT_DIR}/COMPARISON_RESULTS.yaml" || true
else
  echo "[WARN] dependency check skipped: could not fetch ws-depcheck.sh ${DEPCHECK_REV} with the expected hash"
fi
```

Eight lines, which fits the size cap. The `--yaml` call must come after the
script wrote its `COMPARISON_RESULTS.yaml`, or the block is appended to a file
the script then overwrites; scripts that write the YAML last (the usual
`generate_yaml` at the end) should run the step without `--yaml` and append
`${workspace}/dependency-check/dependency-check.yaml` inside `generate_yaml`.

Print the current hash with `sha256sum scripts/rb/ws-depcheck.sh` and the
commit with `git log -1 --format=%H -- scripts/rb/ws-depcheck.sh`.

### Running it by hand

```bash
git clone --depth 1 --branch v2.6.3 https://github.com/KeeperCommunity/bitcoin-keeper /tmp/keeper
scripts/rb/ws-depcheck.sh --src /tmp/keeper --out /tmp/keeper-depcheck
```

Output of that run (2026-10-16, osv-scanner 2.7.0):

```
  lockfiles (5): android/Gemfile.lock Gemfile.lock ios/Gemfile.lock ios/Podfile.lock yarn.lock
  manifests without a lockfile (2): android/app/build.gradle android/build.gradle

  lockfile                                 packages vulnerable advisories
  android/Gemfile.lock                           90          7          9
  Gemfile.lock                                  117          9         19
  ios/Gemfile.lock                              101          1          1
  ios/Podfile.lock                                -          -          -  not scanned (unsupported lockfile)
  yarn.lock                                    1711         52        209
  advisories by severity: malicious 0, critical 3, high 131, moderate 91, low 13, unknown 0
  worst findings:
    critical   9.2  GHSA-w7jw-789q-3m8p    shell-quote@1.8.3 (npm, yarn.lock)
    critical   9.2  GHSA-xv26-6w52-cph6    websocket-driver@0.7.4 (npm, yarn.lock)
    critical   9.1  GHSA-v62p-rq8g-8h59    pbkdf2@3.0.8 (npm, yarn.lock)
  status: ok
```

Files in `--out`: `osv-scanner.json` (the full scanner output, every package
and advisory), `dependency-check.json` and `dependency-check.yaml` (the
summary), `lockfiles.txt`, `unlocked-manifests.txt`, `osv-scanner.log`.

### What it does not know

- A lockfile does not say what ships. `yarn.lock` pins the test and lint
  tooling next to the app's code, and a `Gemfile.lock` is usually fastlane.
  Read the per-lockfile rows with that in mind; the source analysis service
  (`external/source_analysis`) keeps the dev flag per package where the
  lockfile records it.
- osv-scanner reads no `Podfile.lock`, `Package.resolved` or
  `verification-metadata.xml`; those show as `scanned: false`. A gradle
  project without `gradle.lockfile` contributes no packages at all, which is
  exactly the `unlocked_manifests` case.
- An advisory is a snapshot of OSV.dev at scan time, and its severity is the
  CVSS score OSV reports (critical ≥ 9, high ≥ 7, moderate ≥ 4, low > 0;
  `MAL-` identifiers are malicious packages whatever the score).

### Environment

| variable | default | |
|---|---|---|
| `WS_DEPCHECK_CTR` | `docker` if on PATH, else `podman` | container CLI |
| `WS_DEPCHECK_IMAGE` | `ghcr.io/google/osv-scanner@sha256:4f3b…` (v2.7.0) | scanner image, keep it digest-pinned |
| `WS_DEPCHECK_TIMEOUT` | 600 | seconds for the scan |
| `WS_DEPCHECK_SCANNER` | unset | command used instead of the container (tests) |

Tests: `test/unit/rb-depcheck.test.mjs` (inventory, YAML block, failure path,
against a fake scanner).
