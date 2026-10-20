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
and the same exact version, and who requires the package one hop up
(`dependants`, the key a triage statement is made under, see "Triage"). `packages/index.json` in the export lists every
package shipped by two or more products, most shared first.

## Triage: does an advisory affect the product?

Decision of 2026-10-16 (Leo): "only in testing" is not a reason to mute an
advisory; every claimed vulnerability needs a decision whether it affects the
product, the decisions are keyed by the package's **direct user** and the
advisory, and they live on **Nostr**, signed by whoever makes them.

Why the direct user: whether a flaw in `blib` matters is a property of how
`alib` calls it, and that is the same in every wallet that ships `alib`. One
statement about (`alib`, advisory) therefore settles the row in every wallet
where `blib` is only reached via `alib`; the wallet itself is the direct user
when it imports `blib`. Across the 59 checked wallets the 5,900 advisory rows
repeat about 1,100 distinct advisories, and most of them sit under a handful
of direct users, so this is also the only key under which the queue is
finite. The analyser records each package's direct users (`dependants`, one
hop up, from the lockfile graph: package-lock, yarn.lock, Cargo.lock, and
gradle's resolved graph) and whether the wallet imports it (`direct`).

The statement (`src/dependency-triage.mjs`): an addressable Nostr event
(`dependencyTriageKind`), one per author and subject, replaced by a newer
version from the same author:

| tag | meaning |
|---|---|
| `d` | `<advisory>\|via:<ecosystem:name>`, `<advisory>\|app:<appId>`, or `<advisory>\|package` |
| `vuln` | the advisory id and its aliases (GHSA and CVE), one tag each |
| `package` | the vulnerable package, `npm:@babel/traverse` |
| `via` / `app` | the direct user: a package, or a wallet; neither means the package itself, whoever uses it |
| `status` | `affected`, `not_affected`, `fixed`, `under_investigation` (the VEX states) |
| `justification` | optional, an OpenVEX label such as `vulnerable_code_not_in_execute_path` |
| `versions` | optional, the versions of the direct user the statement holds for |
| `evidence` | optional, an http(s) link to the issue, pull request or code line the statement rests on |
| content | the reasoning in prose |

Resolution per (wallet, advisory): the wallet's own `app` statement settles
the row outright. Otherwise every direct user needs a statement (`via`, or a
package-wide one as fallback; when the wallet imports the package itself,
the wallet is one of the direct users and only an `app` or package-wide
statement answers for it); all present means settled with the gravest status
among them, one missing means still open, shown as "Not assessed" and "1 of 2 direct users
assessed". Rows whose files record no graph need a package-wide or `app`
statement.

Who signed decides the weight, not whether a statement is kept:
`_data/dependencyTriage.yml` lists the authors whose statements settle rows
on the site; everyone else's are counted as community statements next to the
row, and the count folds out to show them without settling anything. The direct user's maintainer and the wallet's developer are the authors
whose word should eventually carry: proving a key belongs to a package (a
nostr pubkey in its manifest or repository, as Zapstore links releases to
developers) is the open piece.

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
  (one of the row's direct users, this wallet, or the package itself), the
  status, the OpenVEX justification for "not affected", the versions it
  holds for, an evidence link (issue, pull request, code line; the
  `evidence` tag) and the reasoning. It is signed with the visitor's Nostr
  browser extension (NIP-07, as opinions are), published to the project
  relay and the public relays, and merged into the page at once; the dialog
  says beforehand whether the signer's statements settle rows or count as
  community ones, and publishing again on the same subject replaces the
  author's earlier statement. `scripts/publish-dependency-triage.mjs` does
  the same from the command line with a key in `DEPENDENCY_TRIAGE_NSEC`.
- The project relay stores the kind once `external/configs/strfry/kind-policy.py`
  is deployed; until then the public relays carry the statements.
- The panel's "Decision" column shows the status with one line per direct
  user (its reason and signer), the line under the package name says who the
  direct users are, and the vulnerability tile counts one line per severity,
  "50 critical · none cleared" (cleared: fixed or not affected), then the
  queue: "2 decided · 410 still to look at (3 partly)". The big number takes
  the colour of the worst severity still open. Within one
  severity, rows still needing a look (affected, undecided) sort before
  dismissed ones (not affected, fixed). The CSV carries decision, reasons,
  EPSS and the exploited flag per row.
- "Where?" informs a statement and is shown with it, but does not make it.
  Who made the package is not a reason either, see "No verdict change".

Two public signals ride along, per advisory, pulled at build time by
`scripts/build-advisory-signals.mjs` into `api/source-analysis/signals.json`:
EPSS (FIRST's published probability that a CVE is exploited in the wild
within 30 days) and CISA's Known Exploited Vulnerabilities list. They sort
the queue and put a "critical" label in perspective (944 of the 1,053
advisories have a CVE; 4 are on CISA's list), they decide nothing, and a
failing feed never fails the build.

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

1. Transport of the export to the site: Blossom blob plus signed pointer
   event (recommended, same path as the build verifications) or rsync.
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
