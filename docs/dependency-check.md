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
- **advisory matches**: advisories on [OSV.dev](https://osv.dev) whose
  affected versions include a version a lockfile pins. One advisory can match
  several packages or lockfiles, so the tile also prints the number of
  distinct advisories. A match is not a vulnerability in the app: it means the
  source pins an affected version, not that the vulnerable code runs or can be
  reached (see "What it does not claim").
  - The big number counts only the matches in packages the app ships
    ("Where?" is `app`) plus those the files do not place (`?`), because
    those cannot be ruled out. When both occur the tile says
    "35 shipped · 288 the files do not say", and the label changes to
    "ships or may ship" (or "the files do not say whether the app ships
    them" when none is placed).
  - Below it: the matches in build tools only ("not in the app"), only in
    tests, and only in another product built from the same repository, then
    the total of all matches and of distinct advisories. Each match is
    in exactly one of these numbers, and they add up to the total.
  - The severity lines and the tile colour cover only the big number's
    matches. The severity is the CVSS score OSV reports: critical ≥ 9,
    high ≥ 7, medium ≥ 4, low > 0.
  - A caveat on the tile repeats that a match means a package version is
    listed as affected, not that the app uses the affected part, and, when
    the release has no APK check, that the released app itself was not
    checked.
  - The big number and each "cleared" open an explanation (hover, focus or
    tap), worded for a visitor who has the app installed, see "The tile's
    explanations" below.
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
and the same exact version, and who requires the package one hop up
(`dependants`, the key a triage statement is made under, see "Triage"). `packages/index.json` in the export lists every
package shipped by two or more products, most shared first.

## Triage: does an advisory affect the product?

Decision of 2026-10-16 (Leo): "only in testing" is not a reason to mute an
advisory; every claimed vulnerability needs a decision whether it affects the
product, the decisions are keyed by the package's **direct user** and the
advisory, and they live on **Nostr**, signed by whoever makes them.

Why the direct user: whether a flaw in `blib` matters is a property of how
`alib` calls it; the wallet itself is the direct user when it imports `blib`.
Across the 59 checked wallets the 5,900 advisory rows repeat about 1,100
distinct advisories, and most of them sit under a handful of direct users, so
this is also the key under which other wallets' work can be found again.

Scope, decision of 2026-10-20 (Leo): what one wallet concluded about
(`alib`, advisory) does not decide it for another wallet that ships `alib`;
D-wallet may come to a different conclusion, so the tool shows D-wallet's
reviewers what others think instead of answering for them.

- A statement made for a wallet (it carries `app`, with or without `via`)
  settles rows in that wallet only. Everywhere else it is listed under "What
  others say" on the same row, with its reasoning, evidence and signer, and an
  "Adopt" button that opens this wallet's own statement filled in from it.
- A statement without `app` is a claim about the library itself: how `alib`
  uses `blib` (`via`), or `blib` whoever uses it (neither). It holds for every
  wallet, but only when its author is listed as a maintainer of `alib` (or of
  `blib`) under `maintainers:` in `_data/dependencyTriage.yml`. Anyone else's
  such statement, a trusted reviewer's included, is shown under "What others
  say".
- Statements signed outside the trusted list are shown there too, as
  "community". The analyser records each package's direct users (`dependants`, one
hop up, from the lockfile graph: package-lock, yarn.lock, Cargo.lock, and
gradle's resolved graph) and whether the wallet imports it (`direct`).

The statement (`src/dependency-triage.mjs`): an addressable Nostr event
(`dependencyTriageKind`), one per author and subject, replaced by a newer
version from the same author:

| tag | meaning |
|---|---|
| `d` | `<advisory>\|via:<ecosystem:name>\|app:<appId>`, `<advisory>\|app:<appId>`, `<advisory>\|via:<ecosystem:name>` (maintainers), or `<advisory>\|package` |
| `vuln` | the advisory id and its aliases (GHSA and CVE), one tag each |
| `package` | the vulnerable package, `npm:@babel/traverse` |
| `via` | the direct user, a package; absent when the wallet imports the package itself or the statement is about the package whoever uses it |
| `app` | the wallet the statement is made for, and settles rows in; absent only on a maintainer's statement for every wallet |
| `status` | `affected`, `not_affected`, `fixed`, `under_investigation` (the VEX states) |
| `justification` | optional, an OpenVEX label such as `vulnerable_code_not_in_execute_path` |
| `versions` | optional, the versions of the direct user the statement holds for |
| `evidence` | optional, an http(s) link to the issue, pull request or code line the statement rests on |
| content | the reasoning in prose |

Resolution per (wallet, advisory), counting only statements that settle
here (above): the wallet's own `app` statement without `via` settles the row
outright. Otherwise every direct user needs a statement (this wallet's `via`
one first, then the maintainer's, then a maintainer's package-wide one; when
the wallet imports the package itself, the wallet is one of the direct users
and only an `app` or package-wide statement answers for it); all present
means settled with the gravest status among them, one missing means still
open, shown as "Not assessed" and "1 of 2 direct users assessed". Rows whose
files record no graph need a package-wide or `app` statement.

Who signed decides the weight, not whether a statement is kept:
`_data/dependencyTriage.yml` lists the authors whose statements settle rows
for the wallet they are made for (`trustedAuthors`) and the maintainers whose
statements settle rows everywhere (`maintainers`, per package reference);
everything else is shown under "What others say" without settling anything.
The maintainers list is empty for now: proving a key belongs to a package (a
nostr pubkey in its manifest or repository, as Zapstore links releases to
developers) is the open piece. A statement's author retracts it with a NIP-09
deletion request (kind 5 with a `k` tag naming the statement kind); the build
keeps the request in the snapshot so a relay still serving the statement does
not bring it back.

Plumbing:

- `scripts/build-dependency-triage.mjs` pulls every statement from the
  project relay and the site's public relays during the build, merges it
  with `_data/dependencyTriageEvents.json` (the committed snapshot of every
  signed statement seen so far, verified on read, so a build without relay
  access and a relay that drops events lose nothing), keeps the newest per
  (author, subject), and publishes the statements that concern a wallet as
  `api/source-analysis/triage/<appId>.json` with the trusted list. The panel
  resolves each row from them.
- Writing one on the site: "Add statement" under a row's decision opens a dialog
  (`src/dependencies-triage-form.mjs`) that asks what the statement is about
  (one of the row's direct users in this wallet, this wallet, or the package
  itself; a maintainer of the direct user can tick "this holds for every
  wallet"), the
  status, the OpenVEX justification for "not affected", the versions it
  holds for, an evidence link (issue, pull request, code line; the
  `evidence` tag) and the reasoning. It is signed with the visitor's Nostr
  browser extension (NIP-07, as opinions are), published to the project
  relay and the public relays, and merged into the page at once; the dialog
  says beforehand whether the signer's statements settle rows or are shown
  under "What others say", and publishing again on the same subject replaces the
  author's earlier statement. `scripts/publish-dependency-triage.mjs` does
  the same from the command line with a key in `DEPENDENCY_TRIAGE_NSEC`.
- The project relay stores the kind once `external/configs/strfry/kind-policy.py`
  is deployed; until then the public relays carry the statements.
- The panel's "Decision" column shows the status with one line per direct
  user (its reason and signer), the line under the package name says who the
  direct users are, and the vulnerability tile counts one line per severity
  of what the app ships or may ship, "4 critical · 2 cleared" (cleared: a
  trusted statement says fixed or not affected), then the queue over every
  row, build tooling included: "2 decided · 410 still to look at (3 partly)".
  The big number takes the colour of the worst severity still open. Within one
  severity, rows still needing a look (affected, undecided) sort before
  dismissed ones (not affected, fixed). The CSV carries decision, reasons,
  EPSS and the exploited flag per row.
- "Where?" informs a statement and is shown with it, but does not make it.
  Who made the package is not a reason either, see "No verdict change".

What projects already wrote down for their own scanners rides along too:
`external/source_analysis/upstream-triage-cli.mjs` reads the ignore lists and
VEX documents (`.trivyignore(.yaml)`, `osv-scanner.toml`, `.snyk`,
`.grype.yaml`, `deny.toml`, `audit.toml`, `.nsprc`, `audit-ci.json`,
`.yarnrc.yml`'s `npmAuditIgnoreAdvisories`, `package.json`'s
`pnpm.auditConfig`, `vex.json`/`openvex.json`) of every analysed wallet at
its analysed tag and of every direct user at the tag or commit the identity
check found for the shipped version, through GitHub's GraphQL API when
`GITHUB_TOKEN` is set and raw files otherwise. The export carries the entries
that name one of a wallet's advisories as `upstream/<appId>.json`; the panel
lists each under "What others say" as "(ignore file, unsigned)", linked to the
line, and never settles a row with it. None of these files is a standard and
a plain `.trivyignore` gives no reason. First run, 2026-10-20: 4,316 direct-user
refs in 2,368 repositories, 153 with such a file (almost all Rust's
`deny.toml` and `.cargo/audit.toml`), 66 naming advisories; 6 of the 59
wallets keep one; together they speak to 82 of 7,219 advisory rows.

Two public signals ride along, per advisory, pulled at build time by
`scripts/build-advisory-signals.mjs` into `api/source-analysis/signals.json`:
EPSS (FIRST's published probability that a CVE is exploited in the wild
within 30 days) and CISA's Known Exploited Vulnerabilities list. They sort
the queue and put a "critical" label in perspective (944 of the 1,053
advisories have a CVE; 4 are on CISA's list), they decide nothing, and a
failing feed never fails the build.

### The tile's explanations

The wording is fixed in `src/dependencies-panel.mjs` (`vulnerabilityTipLines`,
`CLEARED_TIP_LINES`). It is plain English for a visitor who has the app
installed, and neutral: it says "report" and "affected", not "vulnerable",
"exploitable" or "attack", and it never says more than the data.

- **The number**: what it counts (published security reports that list a
  package version the app's source uses as affected, only packages that go
  into the app, plus those the files do not place), how it was counted (the
  package list from the public source at the release tag, looked up in
  OSV.dev on the check date; build and test packages listed separately), and
  what it means for the visitor's app: it is about that release, and a report
  says the package version is affected, not whether the app uses the affected
  part. Then either each row says whether the package was found in the
  released app, or the released app itself was not checked. The colour shows
  the highest severity among reports not yet cleared.
- **Cleared**: a reviewer this site trusts looked at the report and signed a
  statement that it does not apply to this app, either "not affected" (the
  app does not use the part the report is about) or "fixed" (the app already
  has the fix), with the reason and signer on the row. A report that is not
  cleared has not been reviewed yet or was found to apply (the Decision
  column says which), and on its own does not mean there is a problem in the
  app.

On phones the tiles stack one per row and the explanation spans the screen
width at a larger text size; each "cleared" has a finger-sized tap target.

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

## Checking the shipped app

The ladder asks whether a dependency is really what the build used. This
section asks the next question: is it really in the app, and is anything in
there that should not be? It is also how the gap named under "What it does
not claim" closes: code no lockfile declares.

### Three levels of verification

1. **Automatic APK check** (one script per wallet, not one per advisory). It
   runs once per wallet and answers every row at the same time:
   1. Unpack the released APK.
   2. List what's inside it.
   3. For each package in the lockfile, check whether its code is in that
      list, and which version.

   The only place it splits is by the kind of code in the APK, because each
   kind hides package names differently. That gives about three detectors
   inside the one script:
   - **Java/Kotlin libraries:** easy, the class names still carry the package
     name (for example `org.bouncycastle`).
   - **Native libraries (`.so`, Rust or C):** medium. They're often stripped,
     so we match file contents against a rebuilt copy instead.
   - **JavaScript bundles** (AirGap, most web-based wallets): the hardest.
     Minifying removes package names, so we match on licence comments that
     survive, or rebuild the bundle with a source map. I'd expect this one to
     leave some rows as "can't tell", and those would stay open for a person.

   "Not found" only counts when the detector for that kind of code is
   reliable. For Java/Kotlin it is. For minified JavaScript the honest answer
   is sometimes "can't tell", and then the row stays open instead of being
   marked "Not in the app".
   Status (2026-10-20): the Java/Kotlin and native detectors exist as
   `external/source_analysis/apk-contents-cli.mjs` (no dependencies beyond
   Node, so a build script can fetch it by commit and check its hash). It
   reads the classes every `classes*.dex` defines, the
   `META-INF/*.version` files, and every `lib/<abi>/*.so`; downloads each
   declared Maven artifact (Google Maven, Maven Central, JitPack, following
   Gradle module metadata) and compares class names, versions, and native
   code by the bytes the library loads (the Android build strips symbols,
   which changes the file but not the code). Build-generated classes (D8
   lambdas and desugaring, R, BuildConfig) are not counted as undeclared.
   First three wallets: BitBanana 1.1.0 (all 35 native libraries identical
   to the published artifacts; the only undeclared Java code is generated
   from the app's own `.proto` files), Blockstream Green 5.7.0 (16 of 18
   native libraries identical; `libgreen_gdk_java.so` is declared nowhere,
   `gdk/fetch_android_binaries.sh` downloads it), Nunchuk 2.9.1 (the
   analysed files declare 167 packages but the APK carries Firebase
   Crashlytics, Matrix, Realm, Stetho and 22 undeclared native libraries,
   and 11 androidx libraries ship in newer versions than the lockfile
   rows the advisories were matched against).
2. **Code search plus a person.** Not a script per advisory: one search tool,
   and a person (or an AI helper) writes a short note with the code lines as
   evidence.
3. **Hand-written attack test.** Only for the handful of serious advisories
   that sit near keys.

### Discrepancies between the lockfile and the APK

- **Code in the APK that no lockfile declares:** a vendored or copied library, a prebuilt `.so`, or an SDK added outside the build files. This is the most important one, because the check today is blind to it.
- **Different version shipped:** the APK has a different version than the lockfile says. Older is worse, because then a fix we counted on isn't there.
- **Same name and version, different content:** the files don't match the published package. That means it's patched, forked, or tampered with.
- **Package listed as build-only but found in the app:** our "build" label was wrong, and the advisory really applies.
- **Two copies of one library:** for example a fixed and an unfixed version bundled side by side.
- **Closed-source binary with no source at all:** this ties to Leo's closed-source rule.

### Malware markers in dependencies

A marker is a reason for a person to look, not proof of malware.

- **Name lookalikes (typosquats):** for example `bitcoinjs-lb` next to `bitcoinjs-lib`.
- **Install scripts** (`postinstall`) that download or run code on the build machine.
- **A sudden change in a package:** a new maintainer, or a release that is much bigger than the previous one or adds new network code.
- **Code loaded at runtime:** `eval`, `DexClassLoader`, or a `.so` downloaded after install. What the app runs is then not what we reviewed.
- **Hidden or packed code:** long encoded strings, heavy obfuscation in a library that is normally readable.
- **Unexpected network calls:** hardcoded hosts or IP addresses that aren't the wallet's own servers or known services.
- **Touching secrets:** reading the clipboard, the seed or keys, or the keystore from a library that has no reason to.
- **Address swapping:** code that rewrites crypto addresses, the classic clipboard hijacker.
- **Unexpected permissions:** a library that needs SMS, accessibility, or overlay permissions.

The first group fits into the level 1 script, because it's the same
unzip-and-compare. The second group is a separate scanner, and I'd treat its
hits as "look here", never as a verdict.

## Measurement first, no verdict change

For now the panel only measures (Leo, 2026-10-16). No verdict and no score
moves because of an advisory, and the panel says so in its badge,
"Measurement only · not part of the verdict". The concern is FUD: a wallet
with 412 advisories next to one with 0 reads as a ranking, and the moment
readers rank by it, developers get pressured to justify every package they
decided not to update. Many of those decisions are correct. A critical
advisory can be "not worth updating" when the vulnerable code is never
reached, or when the flaw needs a position an attacker does not have in this
product. Who made the package is not such a reason: a bug in a Google library
is exploitable by anyone who finds it, the vendor's standing says nothing
about that (Leo, 2026-10-16). The vendor argument belongs to the closed-source
rule above, where the question is trust in code nobody can read. Either way
the triage file records the decision with its reason; nothing is special-cased
in the scanner.

Next to each advisory the panel shows "Used by": how many of the checked
wallets ship the package in any version, and how many this exact version
(`products` / `productsSameVersion` on every advisory and dependency row of
the export). A package shared by twenty wallets is a shared risk, not a
finding against one of them, and the number also says where a fix helps most.

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

1. Transport of the export to the site: decided 2026-10-26 (Luis), no site
   build in the path. The analyser rsyncs its export, `signals.json`
   included, to the web server after every pass, and nginx serves it under
   `/api/source-analysis/` (`external/source_analysis/README.md`,
   "Publishing the export"). Triage statements come from the relay at page
   load, on top of the snapshot the site build publishes under
   `/api/dependency-triage/`. Only the trusted list needs a site build.
2. Whether the panel shape above is final, so the branch can be split into
   reviewable merge requests (build-script step, analyser, panel).
3. The platform-SDK question under the closed-source rule.
4. The dependency-tree plugin stays off (Leo, 2026-10-16: "update X" without
   the path is good enough; the wallet has to get the vulnerability out, not
   be told how). The lockfile graph walk that answers "Where?" is a different
   thing and is in.
5. The `Cargo.lock` walk is in; triage statements live on Nostr (above).
   Next: a re-run of the analyser over the database so every row gets its
   "Where?" and its direct users (today only AirGap is re-scored), the relay
   policy deployment for the statement kind, and the NIP-07 publish path in
   the panel.
6. Beta: `npm run deploy:beta` on this branch ships the panel. The build
   copies the export from `SOURCE_ANALYSIS_EXPORT_DIR` (default
   `external/source_analysis/export`) or unpacks `SOURCE_ANALYSIS_EXPORT_URL`
   (`scripts/copy-source-analysis-export.mjs`); without either the panel
   stays hidden. The interim export is a snapshot of the production database
   re-scored for "Where?" on AirGap only; the live analyser fills the rest
   once it is redeployed.

## Open decisions and server steps (2026-10-20)

Built and on the preview today; what each still needs before a release:

1. **Alerts** (`external/source_analysis/alerts.mjs`): recipients are Leo,
   Danny and Luis. The analyser needs its own key in `ALERT_NOSTR_NSEC` on
   the server; until then alerts are recorded and printed only.
2. **APK check on the page** (`apk/<appId>.json`): nine wallets were checked
   by hand. Each wallet build script needs one line, `--apk` with the
   official APK it already downloads, for the check to run on every
   verified release (needs Leo's OK, the scripts belong to the wallets'
   build recordings).
3. **Other products' lockfiles** (`part`, "desktop app" etc.): counted in
   the tile with a line of their own ("113 only in the desktop app" on
   AirGap). Open: whether they leave the mobile page's count entirely.
4. **Trusted list**: Bob's demo key has no profile and is still listed.
5. **Re-run of the analyser** over the database: the yarn alias and
   workspace fixes, `part`, and the direct users ("Where?", `dependants`)
   all need it; the preview data was patched by hand where noted in the
   commit messages (MetaMask and OneKey malware rows removed, AirGap's
   Electron rows marked).
6. **Upstream harvest** (`upstream-triage-cli.mjs`): run by hand once; it
   wants a schedule next to the analyser (a GitHub token makes it take
   about ten minutes).
7. **Reproducibility of dependencies** (the "reproduced" rung of the
   ladder): explained, not built; a pilot on the 50 most shared npm package
   versions, starting from Google's OSS Rebuild attestations, waits for a go.

## Parked: the vulnerability tile's wording (2026-10-26)

Danny found the tile misleading: "AirGap 3.35.0 has 412 known
vulnerabilities" reads as alarming. Those are 412 advisory matches against
lockfile entries, 332 distinct advisories, and 377 of them are in build
tooling only. Only 35 are in packages the app ships (4 critical, 13 high).

A rework is built, on the preview and reviewed by Danny, but not on this
branch. It waits on Leo and Luis, because it brings back the "in the app ·
in build tooling" split that Leo had removed on 2026-10-20 (there, the
numbers were duplicated; here, each number appears once). The three commits
are on the branch `parked/dependency-tile-shipped-first`, on top of this one:

- The big number counts only the matches in packages the app ships, plus
  those the files do not place. The severity lines and the colour cover
  only that set. Below it: build tools only ("not in the app"), tests
  only, other products, then the total and the distinct advisories.
- The caveat on the tile: a match means a package version is listed as
  affected, not that the app uses the affected part, and, without an APK
  check, that the released app itself was not checked.
- The big number and each "cleared" open an explanation (hover, focus or
  tap) in plain, neutral English for someone who has the app installed:
  "report" and "affected", never "vulnerable", "exploitable" or "attack".
- On phones the tiles stack one per row and the explanation spans the
  screen.
- This document's "What the panel shows" and "Triage" sections, plus a new
  section quoting the wording, are updated on that branch.

To take it: rebase the parked branch onto this one, and check the e2e and
unit tests.
