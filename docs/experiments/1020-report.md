# Issue #1020 experiment: what was wrong, and what changed

Branch `carol/exp-1020`. It is a copy of Danny's `exp/shared-version-matcher` (up to `db7788a265`), plus one commit per item below.

The branch is only an experiment. Nothing was merged, master is unchanged, and the server database was never opened. No table or column was added or changed. Two items (P2, P15/P25) store a different kind of value in an existing column; those are marked **Database note**. They only take effect if this branch ever runs on the server.

Tests: 342 checker tests and 609 site tests, all pass (before: 318 and 594). Every new test fails without its fix.

Each item says its status in brackets:

- **[Fixed]**: the problem is fixed on the branch.
- **[Proposal: Leo]** or **[Proposal: Luis]**: a small default that person can keep or drop.
- **[Needs re-analysis]**: the fix is in the code, but the page changes only after the server analyses that wallet again.
- **[Not changed]**: nothing was changed, and the item says why.

---

## Versions and releases

### P1, P7, P20: fixed before this branch

Danny's branch already fixed these three: Trezor models sharing one tag, Keystone's extra stones, and Coldcard's date stones. This branch keeps that work as it is.

### P9: a reproduced version says "has not been checked" [Fixed, partly]

**What was wrong**
1. A verifier types a version name into the form, for example "9.25.0 - Multi" for the BitBox02.
2. The checker has to find the git tag that this name means. Then it can show that tag's dependencies.
3. BitBox's tags are `firmware/v9.25.0` (Multi) and `firmware-btc-only/v9.25.0` (Bitcoin-only). Neither one contains the word "Multi".
4. So the checker found no tag, and the page said "has not been checked".
5. The same happened in three more cases:
   - P.CASH: "0.59.4" has two tags, one ending `-fdroid` and one ending `-google`.
   - Nunchuk: "1.70.0" is tagged `android.1.70`.
   - BitBox: "Bitcoin-only" is written as `btc-only` in the tags.

**The fix**
- "Multi" now takes the one tag that is *not* marked Bitcoin-only. It can never land on the Bitcoin-only firmware.
- "Bitcoin-only" now also matches `btc-only`.
- A plain Android version now takes the Play Store tag (`-google`). All four P.CASH verifications say "as distributed by Google Play". A version named "- Fdroid" still takes the F-Droid tag.
- A version ending in `.0` is also tried without it, but only if the full name finds nothing.

**Checked:** we compared all 613 version names before and after. 11 gained a tag, and none of the others changed.

**Still no tag, on purpose**
- BitBox "9.23.0": two verifications use this exact name, one for each edition. Any choice would be wrong for one of them.
- Knots "29.3": two different final 29.3 releases exist.
- Bitkey "2026.2.12": a typo for "2026.2.1 (2)".
- Bitkit: its repository has only one tag.
- OneKey Mini: already filed as #1019.

**Caveat:** "plain Android name means Play Store" is a judgement call.

Commit `1f76f47f40`.

### P2: Bitkey's Android page loses release 2025.19.0 [Fixed]

**What was wrong**
1. Bitkey's Android app and iPhone app share one app id.
2. Version "2025.19.0 (6)" was reproduced on Android first, then on iPhone.
3. The checker kept one record per version, holding only the newest platform: iPhone.
4. So the release appeared only on the iPhone page, and the Android page lost it.

**The fix:** the record now remembers every platform the version was reproduced on. Each platform's page gets the release.

**Database note:** the existing `platform` column of `reproducible_versions` can now hold several platforms, one per line. The checker rewrites this table on every pass. If the old code came back, it would read the first platform only, which is what it did anyway.

Commit `accbeb18ac`.

### P3: a later "not reproducible" does not cancel an earlier "reproducible" [Proposal: Leo]

**What was wrong**
1. On one day, Edge 4.44.0 was marked "reproducible", and later "not reproducible", by the same person for the same file.
2. A newer verdict only replaces an older one if both carry the same hidden id (`d`).
3. Older verifications got a random id, so the second verdict became a separate event.
4. So the old "reproducible" kept counting.

**The fix (proposal):** a "reproducible" stops counting when a later "not reproducible" matches all three of these:
- the same author;
- the same app and version;
- at least one file hash in common.

A later "failed to build", another author or another file does not cancel it.

**Effect on today's data:** exactly 4 versions drop: Edge 4.44.0, Nunchuk 2.3.0, Passport Prime "1.2.0 - Recovery" and Bitkey 2025.14.1. Edge's Android panel disappears, because Edge then has no reproducible version left.

**For Leo**
- Is "same author and same file" the right test for a revision?
- Should a later "failed to build" count too?
- To drop the proposal, revert this one commit.

Commit `45d7202fb3`.

### P4: anyone's "reproducible" counts, and disagreements aren't shown [Proposal: Leo]

**What was wrong**
1. One "reproducible" verdict from anyone puts a version on the page. That includes a maker verifying its own app (Trustless, Keycard Shell).
2. 44 versions on show also have a "not reproducible" verdict. For example, Wasabi 2.8.5 is reproducible for the zip, but not for the msi.
3. The Dependencies panel never mentions the disagreement.

**The fix (smallest proposal):** who counts is unchanged. When a version has both kinds of verdict, the panel adds one sentence:

> 1 verification of version X found it not reproducible, and 2 found it reproducible. Its dependencies are shown because one reproducible verification is enough; each verdict is under "Every version".

**For Leo:** should a maker's own verification count? We did not change that, because it would quietly change which wallets are shown.

Commit `b3e29f95a6`.

### P5: a moved tag is never analysed again [Fixed, needs re-analysis]

**What was wrong**
1. Envoy's tag `v2.3.7` was analysed on 2026-10-28.
2. The next day the maker deleted that tag and created it again, on different code.
3. To decide whether a release was already done, the checker looked only at the tag's *name*.
4. So the old analysis stayed forever.

**The fix**
- The checker already knows which commit each tag points at. A finished analysis now counts only if it was made at that commit.
- If the tag moved, the release is analysed again, once.
- If that new analysis fails, the old result stays and is not retried every pass. A review found the retry loop, and we fixed it before handing over.
- Older analyses with no recorded commit still count as done, so they are not all redone at once.

**Expected on the next server pass:** about 2 tags are analysed again, Envoy `v2.3.7` and SeedSigner `0.8.6` (see P28).

Commits `f7ab637c69` and `23ab9ecf62`.

### P6: one test run showed part of the relay data [Fixed: one real cause found]

**What was wrong**
- The browser case did not come back in 5 more runs.
- We found a real way the checker could shrink its own saved list:
  1. relay.nostr.info holds every verification. The other relays hold fewer.
  2. When a relay can't be reached, the Nostr library returns an empty list, not an error.
  3. So with the main relay down, the checker accepted the smaller relays' events as a full read.
  4. It then replaced its whole saved list with them, which could drop wallets.

**The fix:** if the main relay returns nothing, the read counts as failed, and the saved list is kept.

**Caveat:** the browser page reads the relays with its own code. So the original browser symptom remains "not reproduced".

Commit `47dc725aa4`.

### P28: a branch with the tag's name gets analysed instead of the tag [Fixed, needs re-analysis]

**What was wrong**
1. SeedSigner has a tag `0.8.6`, and also a branch called `0.8.6`, on different code.
2. The checker downloaded it with `git clone --branch 0.8.6`.
3. When a branch and a tag share a name, git picks the branch.
4. So the checker analysed the branch, not the release.

**The fix:** the checker now asks for the tag by its full name (`refs/tags/0.8.6`). It uses a branch only if no such tag exists.

Commit `98431ba524`.

---

## Advisories and counts

### P15: 1,627 advisory rows say "unknown" severity [Fixed, partly]

**What was wrong**
1. Severity comes from a score called CVSS.
2. Some advisories carry only the newer CVSS 4.0 score, and the checker could only read version 3.
3. Some databases put the score next to the package, not at the top of the record, and the checker didn't look there.

**The fix**
- The checker now computes CVSS 4.0 scores itself. It uses the same tables and rounding as the official calculator from FIRST, the group that maintains CVSS, and we added no new package.
- The checker now also reads the score stored next to the package.

**Checked:** 20,000 random scores matched the official calculator. 39 rows (6 advisories) now get a rating.

Commit `2938f9c6dd`.

### P25: the rated twin of an advisory is ignored, and "unmaintained" notices count as flaws [Fixed]

**What was wrong**
1. The same flaw often has two records, for example a PYSEC one and a GHSA one.
2. OSV.dev often returns only the record with no rating, so the page shows "unknown" while its twin is rated "high".
3. RustSec also publishes notices, like "this package is unmaintained". These were counted as if they were security flaws.

**The fix**
- An unrated record now takes the rating of its twin. The twin is fetched once per run, and a failed fetch never stops the check.
- Notices are now labelled "Notice", listed last, and left out of the advisory count. The tile says how many were left out.

**Effect:** of the 1,627 "unknown" rows, 1,199 become notices and 46 get a real rating. 382 stay unknown, because no database rates them at all.

**Database note:** the existing `severity` column gains the new value `informational`. The hourly refresh rewrites these rows, so the first refresh after a deploy would re-publish most wallets once.

**Open:** should "unsound" count as a notice or as a real flaw? Switching it is a one-line change.

Commits `b47a7c8a9e` and `23ab9ecf62`.

### P18: "Used by" counts wallets the site doesn't show [Fixed]

**What was wrong**
1. A row says, for example, "deepmerge 4.3.1: used by 22 wallets".
2. That count covered every app in the database, including apps and releases the site never shows.
3. Only 8 of the shown wallets really have that version.

**The fix:** the count now covers only the releases the site shows.

Commits `6d04c9eb2d` and `a8c455c0ce`.

### P23: test tools listed as app code [Fixed, partly]

**What was wrong**
- Tools that only run in tests (junit, mockito, jest and others) were labelled "app", as if they ship in the wallet. There were three causes:
  1. **Gradle:** every declared package was labelled "app", even when it was added only to a test configuration (`testImplementation`).
  2. **npm/yarn:** when a library listed a test tool, the wallet's own test tool was pulled into the app, together with everything it uses. Zeus got jest this way.
  3. **Upstream mislabels:** some libraries list test tools as normal dependencies.

**The fix**
- Gradle reads which configuration each package goes into. A package used only in tests is labelled "tests".
- npm/yarn: when a package is the wallet's own test tool, and the wallet declares it only for development, it stays on the test side.
- A tool the wallet ships in its own normal dependencies, such as BlueWallet's detox, stays "app". That label is correct.

**Effect:** on 12 wallets, test tools labelled "app" drop from 74 to 22 (Zeus 5 → 0, P.cash 17 → 1).

Commits `b61adc0fef` and `23ab9ecf62`. The second one stops "testnet" and "latest" from counting as test words.

### P13: a statement settles versions it wasn't about [Fixed, proposal: Leo/Dan]

**What was wrong**
1. Someone writes a statement, for example that secp256k1 is "not affected" in AirGap. They were looking at version 4.0.3.
2. The statement doesn't name a version.
3. The panel applied it to every secp256k1 row of that release, so 5.0.0 was settled too, though nobody had looked at it.

**The fix**
- A statement about one direct user now covers only the rows that user needs.
- When a release has several versions of the package, the statement covers only the versions its text names.
- Otherwise the row is reopened, with "check again".
- The statement form now records the same narrow set.

**Effect:** AirGap v3.34.4 goes from 29 settled rows to 28. Only secp256k1 5.0.0 reopens.

**Caveat:** reading versions from the statement's text is a heuristic. It only affects the 32 old statements without version tags.

Commit `1d53acf2c0`.

### P11: LNbits HWW firmware rated "locked" [Fixed, needs re-analysis]

**What was wrong**
1. The LNbits hardware wallet firmware is an Arduino sketch, a `.ino` file.
2. The checker didn't know Arduino sketches are C/C++ builds.
3. So it saw only the web app's npm lockfile and decided "everything is locked".

**The fix:** a `.ino` sketch and `platformio.ini` now count as a C/C++ build that wasn't read. So the rating becomes "unknown", with the sketch listed as unread.

**Needs:** a re-analysis of LNbits on the server (`node reanalyse-cli.mjs --app-id arcbtc.lnbits.hww`).

Commit `de4d06e7df`.

---

## What the panel shows

### P10: the panel shows one release, then jumps to another [Fixed]

**What was wrong**
1. You open AirGap's page.
2. The panel loads fast and shows the newest checked release, v3.34.4.
3. The "Every version" row is still waiting for the relays.
4. 0.2 to 6 seconds later it picks 3.35.0, and the panel repaints as "3.35.0 has not been checked".
5. So you see one release, then another.

**The fix**
- On pages with an "Every version" row, the panel first shows one neutral line, "Loading the release picked under Every version…".
- It paints only the release that row picks.
- If no pick comes within 15 seconds, it falls back to the newest checked release, as before.

Commit `5bad451f60`.

### P27: "Nostr pool not initialized" in the console [Fixed]

**What was wrong**
1. The test script reused one browser tab for ten pages.
2. When the tab left Bitkey for Passport Prime, Bitkey's page closed the shared relay connection while it was still loading.
3. So the error came from the test script, not from Passport Prime, and it is not behind P10.

**There is also a real case**
1. The connection closed on `beforeunload`. That event also fires when the reader stays on the page: they cancel a "leave site?" prompt, a link starts a download, or they come back with the Back button.
2. After that the page had no connection, and every later relay read failed.

**The fix:** the connection now closes only when the page really goes away.

Commit `8a3a490415`.

### P14: the same signer shown as a name on some rows and an npub on others [Fixed]

**What was wrong**
1. The panel shows the 10 worst rows and looks up the signers' names once.
2. "Show all" adds more rows later, and nobody looked up their names.
3. So 2 rows said "Carol" and 26 rows by the same key showed a long npub.
4. The statement form showed the npub too.

**The fix:** the rows that "Show all" adds get the same name lookup. The form says "Signing as Carol" once the name is found.

Commit `2035a5090e`.

### P16: the panel doesn't say when advisories were last looked up [Fixed, partly]

**What was wrong**
1. The panel says "Checked on 2026-10-29". That is when the release was analysed.
2. Advisories are looked up again every hour, but the page never says so.

**The fix:** the export now includes the time of the last advisory lookup, and the headline adds "Advisories looked up on <date>". The time comes from data the database already stores.

**Limits**
- A release with no advisories has no such time, so it shows only "Checked on". Fixing that would need a new database column.
- The date can be up to one 6-hour pass old. The hourly refresh only re-exports wallets whose advisories changed.

Commit `c52d235d41`.

### P17: "only this wallet" isn't flagged [Fixed]

**What was wrong**
1. "only this wallet" looked like any other grey count.
2. It appeared only on advisory rows.
3. Electrum has 67 packages no other wallet uses, and only 3 were visible.

**The fix:** "only this wallet" is now a small coloured pill with an explanation. The dependency tree shows it on every such package, with or without an advisory.

Commit `d0c3c7bc0f`.

### P19: the submodule reason says only "and the repository exists." [Fixed]

**What was wrong**
1. A Keystone submodule can't be downloaded.
2. git prints the real reason first, then some general advice.
3. The checker kept only the last line of the advice: "and the repository exists."

**The fix**
- The checker now keeps git's real error line.
- Rows already stored still hold the old text. For those, the panel shows "git could not read the repository (no access to it, or it does not exist)".

Commits `b5a981af78` and `f728c74b42`.

### P21: Wasabi's .NET packages are never read [Fixed, needs re-analysis]

**What was wrong**
1. Wasabi is a .NET wallet. Its lockfiles are called `packages.lock.json`, and it has six of them.
2. The checker had no reader for that file, so it found 0 packages.
3. The page blamed only downloads and binaries, so readers might think there was nothing to check.

**The fix**
- The checker now reads NuGet lockfiles and asks OSV.dev about them.
- A .NET project with no lockfile is now named on the page, with the setting that turns lockfiles on.
- Test projects don't count.

**Checked:** on Wasabi v2.8.5, the checker went from 0 rows to 310 rows, from 110 packages. OSV.dev returned one advisory, for `Microsoft.AspNetCore.WebUtilities` 10.0.14.

**Needs:** a re-analysis of Wasabi on the server.

Commit `ff695f5cb8`.

### P22: Bitcoin Core says "No published advisories found" [Fixed]

**What was wrong**
1. For Bitcoin Core, the checker read only 3 Python packages, from a lint tool.
2. It read none of the C/C++ build.
3. Yet the tab said "No published advisories found", which sounds like "clean".

**The fix:** when part of the build wasn't read, the tab now says so: "No published advisories found in the part of this release this check could read. The rest was not checked, so this is not 'none'."

**Open:** Bitcoin Core's own advisories are a separate scope question for Leo (#1022). This branch doesn't change that.

Commit `3110b5500e`.

### P26: the Advisories tab doesn't say where its rows come from [Fixed]

**What was wrong:** a reader could think the advisories were found in the shipped app. In fact they come from the source code's lockfiles.

**The fix:** the tab now opens with one line: "From the dependency files (lockfiles) in this release's source code, not from the build that was reproduced."

Commit `3d1787a712`.

### P24: wallets with no rules file don't say so [Not changed; proposal: Luis]

Luis removed this line on purpose (`7942d53d5f`), so we left it out.

If Luis wants it back, the proposal is to add one clause to the existing "How to read this" sentence, only for wallets with no rules file:

> This wallet has no such list yet, so every one of its files counts here.

### P12: the docs say Gradle without a lockfile "contributes nothing" [Fixed]

**What was wrong**
- The docs said such a project adds nothing. In fact it adds a row for every package declared in the build files.
- When the project has a Gradle wrapper, the checker also resolves the full package list.

**The fix**
- The docs now say what such a project adds, and what is missing.
- The list of supported ecosystems is corrected, and NuGet is added.

Commit `8e41921e25`.
