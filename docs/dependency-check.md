# Dependency check

What the "Dependencies" panel on a wallet page says, where the data comes
from, what it does not claim, and the rules for publishing it. The three code
parts are documented next to the code; this page is the methodology that ties
them together and the text behind the panel's "What is this?" link.

| part | where | documented in |
|---|---|---|
| dependency check step for the reproducible-build scripts | `scripts/rb/ws-depcheck.sh` | `scripts/rb/README.md` |
| source analysis service: resolves every lockfile of every release, matches OSV.dev, records each analysis, exports static JSON | `external/source_analysis/` | `external/source_analysis/README.md` ("Static export", "Database Schema") |
| wallet-page panel, painted from the export | `src/dependencies-panel.mjs`, `src/dependencies-panel-model.mjs`, `_includes/review/steps/dependencies.html` | this page; `test/unit/dependencies-panel*.test.mjs` are the executable spec |

## What the panel shows

For one release of a wallet, read from the lockfiles in the wallet's public
source repository at that release's tag:

- **packages found**: every package a lockfile pins, across all ecosystems the
  repository uses (npm, Maven/Gradle, CocoaPods, RubyGems, PyPI, Go, Cargo).
- **could not be checked**: packages with no exact registry version to look
  up (a git URL, a local path, a version range the lockfile left open). This
  is not "no problems"; it is "nobody looked". Releases analysed before
  2026-10-16 show a dash because the record did not exist yet.
- **known vulnerabilities**: advisories on [OSV.dev](https://osv.dev) that
  match a pinned version, counted per advisory and split by severity. The
  severity is the CVSS score OSV reports: critical ≥ 9, high ≥ 7, medium ≥ 4,
  low > 0.
- **known malware**: packages OSV lists as malicious (`MAL-` identifiers),
  whatever the score.
- **Where?**: where the package ends up, as far as the files say. `app`
  when it is reachable from the project's own dependencies, so it is bundled;
  `build` when only from its development dependencies; `tests` when only from
  test frameworks and test tooling among those; `?` when nothing says.
  `package-lock.json` records the dev flag; `yarn.lock` and `Cargo.lock`
  record the graph but no flag, so the analyser walks the graph from the
  manifest's roots; gradle resolution derives it from the configuration names.
  This is a placement fact, not a judgement: a build dependency can still hurt
  the product (an install script runs on the developer's machine), which is
  why every advisory gets its own decision, see "Triage" below.
- **checked release vs store version**: the analysed tag and the version the
  store lists. When they differ, the panel says so instead of presenting old
  data as current.
- the ten worst advisories, a button for the full list, a CSV of the full
  dependency list, and the lockfiles that were read.

Every row also carries how many WalletScrutiny products ship the same package
and the same exact version. `packages/index.json` in the export lists every
package shipped by two or more products, most shared first.

## Triage: does an advisory affect the product?

Decision of 2026-10-16 (Leo): "only in testing" is not a reason to mute an
advisory; every claimed vulnerability needs a decision whether it affects the
product. The industry format for exactly this is VEX (Vulnerability
Exploitability eXchange): per (product, advisory) one of `affected`,
`not_affected`, `fixed` or `under_investigation`, with a justification.

Planned shape:

- every advisory starts as undecided; the panel headline counts decided
  against total, and the undecided count is the work queue;
- our decisions live as a small YAML file per wallet in the site repository,
  reviewed like a verdict change, one line of justification each;
- a wallet developer can hand us their own OpenVEX document; it is shown as
  "developer says: not affected" next to our call, never instead of it;
- "Where?" informs the decision and is shown with it, but does not make it.

## What it does not claim

- **Reachability.** A vulnerable version in a lockfile does not mean the
  vulnerable function runs, or runs with anything an attacker controls. The
  panel never says "exploitable".
- **Completeness.** Only lockfiles are read. A gradle project without
  `gradle.lockfile` or `verification-metadata.xml` contributes nothing, and
  osv-scanner reads no `Podfile.lock` or `Package.resolved`. Binary
  dependencies that are not declared in any manifest (a vendored `.so`, a
  prebuilt framework) are invisible to this check.
- **Currency.** The result is a snapshot of OSV.dev on the check date. New
  advisories against the same versions appear later; the date is printed on
  the panel for that reason.
- **The verdict.** The panel is marked "separate from our verdict and score"
  and stays that way until the "In the app?" column is mostly answered. A
  count of 400 advisories next to a wallet's name says more than the data
  supports while most rows are build tooling nobody ships.

## Scope: which wallets and releases

Decision of 2026-10-16 (Leo): dependencies get the same treatment as the
wallet binary, so the check is only meaningful for wallets whose binary is
reproducible from the analysed source. The transitive dependencies of a
wallet that fails to build from its source tell nothing about the shipped
app.

- The analyser reads the verdicts from the site and analyses wallets with a
  reproducible verdict, at the tags of their verified versions.
- Everything else stays in the database as supplementary data and is not
  shown on the wallet page.
- This reverses the earlier "analyse every release" rule from 2026-10-02.

## The ladder: how far each dependency is verified

Each dependency starts at "not tested yet" and climbs:

| level | meaning | how it is established |
|---|---|---|
| identity | we know exactly which artifact the build consumed | lockfile hash or registry version (every row today) |
| provenance | the registry attests which source commit and build produced the artifact | npm provenance, PyPI attestations, Reproducible Central for Maven; checked automatically |
| reproduced | we rebuilt the artifact from source and it matches | a build recording like a wallet's; one rebuild of a shared package covers every product that ships that version, so the most shared packages go first |
| closed | no source | see the verdict rule below |

The panel will show the level per dependency and the share per wallet.
Rebuilding is planned per ecosystem, npm first.

**Closed-source dependency rule** (Leo, 2026-10-16): a wallet that ships a
closed-source library is itself not open source and gets that verdict. Open
question, data in hand either way: whether platform SDKs from the OS vendor
(Google Play Services, Firebase; 16 of the 37 gradle projects in the
2026-10-16 data ship them) count, or only third-party closed libraries. The
proposal on the table lists platform SDKs as "closed source, platform" without
flipping the verdict, and flips it for everything else.

## Measurement first, no verdict change

For now the panel only measures (Leo, 2026-10-16). No verdict and no score
moves because of an advisory, and the panel says so in its badge,
"Measurement only · not part of the verdict". The concern is FUD: a wallet
with 412 advisories next to one with 0 reads as a ranking, and the moment
readers rank by it, developers get pressured to justify every package they
decided not to update. Many of those decisions are correct. A critical
advisory can be "not worth updating" when the vulnerable code is never
reached, or when the package comes from a vendor the platform already trusts:
`com.google.gms:google-services` on an Android phone adds nothing to what
Google can already do through the operating system, unless the phone runs
GrapheneOS. The triage file records that as a "not affected" decision with
the reason, it is not special-cased in the scanner.

Rules that follow:

- The headline and the note say "advisories present", never "vulnerabilities
  in the wallet". The note states that a listed advisory is not a defect and
  that leaving a version in place is often the right call.
- No list, filter, badge or sort order anywhere on the site uses the
  advisory count, until the triage exists and the count shown is the
  "affected" count rather than the raw one.
- The developer's own call is shown next to ours once they hand us a VEX
  document, so the page carries their reasoning, not only our count.

## Publishing and disclosure

Two kinds of findings, two rules.

**Known advisories against public lockfiles: published, no embargo.** Every
advisory the panel shows is a published GHSA/OSV entry and every version comes
from a lockfile in a public repository. Anyone running `npm audit` or
`osv-scanner` on that repository gets the same rows in a minute, and attackers
do run exactly that. The panel adds attribution and aggregation, not new
knowledge. This is the same category as deps.dev, Snyk Advisor and the Debian
security tracker, all public. A `MAL-` identifier already on OSV is in this
category too.

**Findings of our own: private first.** Anything this work discovers that is
not yet public goes to the maintainer and, where one exists, the registry's
security contact before it goes anywhere else, and is published after the fix
ships or after 90 days, whichever comes first. The wallet page credits the
finding only once it is public. This covers:

- a published package whose artifact does not match its source (the
  "reproduced" level failing);
- malware or a backdoor spotted before it has an OSV entry;
- a wallet where a vulnerable function is provably reachable from key
  material.

**Courtesy before launch.** The developers of wallets with critical "Shipped"
rows get a heads-up a week before the panel goes live, the same practice as a
verdict change.

## Open decisions (2026-10-16)

1. Transport of the export to the site: Blossom blob plus signed pointer
   event (recommended, same path as the build verifications) or rsync.
2. Whether the panel shape above is final, so the branch can be split into
   reviewable merge requests (build-script step, analyser, panel).
3. The platform-SDK question under the closed-source rule.
4. The dependency-tree plugin stays off (Leo, 2026-10-16: "update X" without
   the path is good enough; the wallet has to get the vulnerability out, not
   be told how). The lockfile graph walk that answers "Where?" is a different
   thing and is in.
5. The `Cargo.lock` walk is in; the VEX (triage) file is the next step, then
   a re-run of the analyser over the database so every row gets its "Where?".
6. Beta: `npm run deploy:beta` on this branch ships the panel. The build
   copies the export from `SOURCE_ANALYSIS_EXPORT_DIR` (default
   `external/source_analysis/export`) or unpacks `SOURCE_ANALYSIS_EXPORT_URL`
   (`scripts/copy-source-analysis-export.mjs`); without either the panel
   stays hidden. The interim export is a snapshot of the production database
   re-scored for "Where?" on AirGap only; the live analyser fills the rest
   once it is redeployed.
