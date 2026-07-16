(function () {
  const PARTICLE_SYMBOLS = [
    "{", "}", "0x", "sha", "apk", "git", "fn", "if", "==", "!=", "hash", "//", "src",
    "npm", "sig", "key", "btc", "verify", "diff", "build", "apk", "gradle",
  ];

  const INTRO_LINES = [
    { text: "$ sha256sum wallet-release.apk", type: "command" },
    { text: "a3f8c21be94d...  wallet-release.apk", type: "output" },
    { text: "$ git clone https://github.com/example/wallet", type: "command" },
    { text: "Cloning into 'wallet'...", type: "output" },
    { text: "remote: Enumerating objects: 8421, done.", type: "muted" },
    { text: "Receiving objects: 100% (8421/8421), done.", type: "muted" },
    { text: "$ git checkout tags/v3.2.1", type: "command" },
    { text: "HEAD is now at a8f2c1d release: v3.2.1", type: "output" },
    { text: "$ ./reproduce.sh --release", type: "command" },
    { text: "Fetching build dependencies...", type: "output" },
    { text: "$ gradle assembleRelease", type: "command" },
    { text: "> Task :app:compileReleaseKotlin", type: "muted" },
    { text: "> Task :app:mergeReleaseResources", type: "muted" },
    { text: "> Task :app:packageRelease", type: "muted" },
    { text: "BUILD SUCCESSFUL in 2m 14s", type: "success" },
    { text: "$ sha256sum build/outputs/apk/release/app.apk", type: "command" },
    { text: "a3f8c21be94d...  app.apk", type: "output" },
    { text: "Comparing with published binary...", type: "output" },
    { text: "match: a3f8c21be94d", type: "success" },
    { text: "$ zipalign -c -v 4 app.apk", type: "command" },
    { text: "Verification successful", type: "success" },
    { text: "$ apksigner verify --verbose app.apk", type: "command" },
    { text: "Verified using v2 scheme (APK Signature Scheme v2)", type: "output" },
    { text: "Number of signers: 1", type: "muted" },
    { text: "$ dexdump -d classes.dex | head -20", type: "command" },
    { text: "Processing 'Lcom/wallet/MainActivity;'", type: "muted" },
    { text: "Processing 'Lcom/wallet/WalletService;'", type: "muted" },
    { text: "$ proguard-check mapping.txt", type: "command" },
    { text: "Obfuscation map matches published release", type: "success" },
    { text: "$ spdx-check --recursive src/", type: "command" },
    { text: "MIT, Apache-2.0, BSD-3-Clause — OK", type: "success" },
    { text: "$ reproducible --attest --publish", type: "command" },
    { text: "Preparing signed verification payload...", type: "output" },
    { text: "Publishing to Nostr relays...", type: "output" },
    { text: "wss://relay.damus.io: event accepted", type: "success" },
    { text: "wss://nos.lol: event accepted", type: "success" },
    { text: "Build verification complete.", type: "success" },
  ];

  const LOOP_LINES = [
    ...INTRO_LINES,
    { text: "$ jar tf classes.dex | head -12", type: "command" },
    { text: "META-INF/MANIFEST.MF", type: "output" },
    { text: "classes.dex", type: "output" },
    { text: "lib/arm64-v8a/libbitcoin.so", type: "output" },
    { text: "lib/armeabi-v7a/libbitcoin.so", type: "output" },
    { text: "res/layout/activity_main.xml", type: "output" },
    { text: "res/drawable/ic_launcher.png", type: "output" },
    { text: "$ strings classes.dex | grep -i bitcoin", type: "command" },
    { text: "org/bitcoinj/core/PeerGroup", type: "muted" },
    { text: "Lcom/wallet/KeyManager;", type: "muted" },
    { text: "Lcom/wallet/TransactionBuilder;", type: "muted" },
    { text: "Checking dependency tree...", type: "output" },
    { text: "$ reproducible --compare-signatures", type: "command" },
    { text: "v1 signature: present", type: "output" },
    { text: "v2 signature: present", type: "success" },
    { text: "v3 signature: missing", type: "warning" },
    { text: "$ git log -3 --oneline", type: "command" },
    { text: "a8f2c1d release: v3.2.1", type: "output" },
    { text: "b7e1a9f fix: fee estimation", type: "output" },
    { text: "c3d4e5a chore: bump kotlin", type: "output" },
    { text: "Running lint on native libs...", type: "output" },
    { text: "ELF alignment OK", type: "success" },
    { text: "$ nostr-verify --event-id abc123", type: "command" },
    { text: "attestation valid", type: "success" },
    { text: "$ scanelf -n app/lib/*/*.so", type: "command" },
    { text: "No unexpected native exports", type: "success" },
    { text: "$ readelf -d lib/arm64-v8a/libbitcoin.so", type: "command" },
    { text: "NEEDED: libc.so, libm.so, libdl.so", type: "muted" },
    { text: "$ apkanalyzer dex packages app.apk", type: "command" },
    { text: "com.wallet, org.bitcoinj, androidx.core", type: "output" },
    { text: "$ grep -r \"bc1\" assets/ || true", type: "command" },
    { text: "No hardcoded addresses in assets", type: "success" },
    { text: "$ license-check --strict dependencies.lock", type: "command" },
    { text: "All dependency licenses allow redistribution", type: "success" },
    { text: "$ diffoscope published.apk reproduced.apk", type: "command" },
    { text: "No differences reported", type: "success" },
    { text: "$ nostr-query --tag h a3f8c21be94d", type: "command" },
    { text: "3 matching attestations from 2 pubkeys", type: "output" },
    { text: "$ verify-trust-root --pubkey npub1...", type: "command" },
    { text: "Publisher key matches prior releases", type: "success" },
    { text: "$ checksec --file lib/arm64-v8a/libbitcoin.so", type: "command" },
    { text: "RELRO: full, Canary: yes, NX: yes, PIE: yes", type: "success" },
    { text: "$ semgrep --config auto src/", type: "command" },
    { text: "No critical findings in wallet sources", type: "success" },
  ];

  const VERDICT = {
    type: "pass",
    icon: "\u2713",
    label: "VERIFIED",
    detail: "Binary matches published source",
  };

  const CHAR_MS = 28;
  const LINE_PAUSE_MS = 160;
  const PRUNE_VIEWPORTS = 2;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function waitForLayout() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }

  function createParticles(container, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className = "hero-visual__particle";
      particle.textContent = PARTICLE_SYMBOLS[i % PARTICLE_SYMBOLS.length];
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--delay", `${Math.random() * 12}s`);
      particle.style.setProperty("--duration", `${10 + Math.random() * 14}s`);
      particle.style.setProperty("--drift", `${-30 + Math.random() * 60}px`);
      particle.style.setProperty("--opacity", `${0.08 + Math.random() * 0.18}`);
      fragment.appendChild(particle);
    }
    container.appendChild(fragment);
  }

  function HeroVisualPlayer(root) {
    this.root = root;
    this.linesWrapEl = root.querySelector(".hero-visual__lines-wrap");
    this.linesEl = root.querySelector("#heroVisualLines");
    this.cursorEl = root.querySelector("#heroVisualCursor");
    this.verdictEl = root.querySelector("#heroVisualVerdict");
    this.verdictIconEl = root.querySelector("#heroVisualVerdictIcon");
    this.verdictLabelEl = root.querySelector("#heroVisualVerdictLabel");
    this.verdictDetailEl = root.querySelector("#heroVisualVerdictDetail");
    this.statusEl = root.querySelector("#heroVisualStatus");
    this.badgesEl = root.querySelector("#heroVisualBadges");
    this.screenEl = root.querySelector("#heroVisualScreen");
    this.paused = false;
    this.reducedMotion = prefersReducedMotion();
    this.scrollY = 0;
    this.verdictShown = false;
  }

  HeroVisualPlayer.prototype.waitWhilePaused = async function () {
    while (this.paused) {
      await sleep(250);
    }
  };

  HeroVisualPlayer.prototype.getViewportHeight = function () {
    return this.linesWrapEl ? this.linesWrapEl.clientHeight : 0;
  };

  HeroVisualPlayer.prototype.getMaxScroll = function () {
    return Math.max(0, this.linesEl.scrollHeight - this.getViewportHeight());
  };

  HeroVisualPlayer.prototype.scrollToBottom = function () {
    this.scrollY = this.getMaxScroll();
    this.linesEl.style.transition = "none";
    this.linesEl.style.transform = `translate3d(0, -${this.scrollY}px, 0)`;
  };

  HeroVisualPlayer.prototype.pruneOldLines = function () {
    const viewport = this.getViewportHeight();
    if (!viewport) {
      return;
    }

    const pruneAbove = this.scrollY - viewport * PRUNE_VIEWPORTS;
    if (pruneAbove <= 0) {
      return;
    }

    let removedHeight = 0;
    let cumulativeHeight = 0;

    while (this.linesEl.firstChild) {
      const row = this.linesEl.firstChild;
      const rowHeight = row.offsetHeight;
      if (cumulativeHeight + rowHeight <= pruneAbove) {
        cumulativeHeight += rowHeight;
        removedHeight += rowHeight;
        this.linesEl.removeChild(row);
      } else {
        break;
      }
    }

    if (removedHeight > 0) {
      this.scrollY = Math.max(0, this.scrollY - removedHeight);
      this.linesEl.style.transition = "none";
      this.linesEl.style.transform = `translate3d(0, -${this.scrollY}px, 0)`;
    }
  };

  HeroVisualPlayer.prototype.typeLine = async function (line) {
    await this.waitWhilePaused();

    const row = document.createElement("div");
    row.className = `hero-visual__line hero-visual__line--${line.type}`;
    this.linesEl.appendChild(row);

    if (this.verdictShown) {
      this.cursorEl.classList.add("is-hidden");
    } else {
      this.cursorEl.classList.remove("is-hidden");
    }

    if (this.reducedMotion) {
      row.textContent = line.text;
      this.scrollToBottom();
      return;
    }

    for (let i = 0; i < line.text.length; i += 1) {
      await this.waitWhilePaused();
      row.textContent += line.text.charAt(i);
      if (i % 3 === 0) {
        this.scrollToBottom();
      }
      await sleep(CHAR_MS);
    }

    this.scrollToBottom();
  };

  HeroVisualPlayer.prototype.showVerdict = function () {
    this.verdictShown = true;
    this.cursorEl.classList.add("is-hidden");
    this.verdictEl.classList.remove("hero-visual__verdict--pass", "hero-visual__verdict--fail");
    this.verdictEl.classList.add(`hero-visual__verdict--${VERDICT.type}`);
    this.verdictIconEl.textContent = VERDICT.icon;
    this.verdictLabelEl.textContent = VERDICT.label;
    this.verdictDetailEl.textContent = VERDICT.detail;
    this.verdictEl.hidden = false;
    this.verdictEl.classList.add("is-visible");
    this.screenEl.classList.add("is-verdict-visible");
    this.root.classList.add("hero-visual--flash-pass");

    if (!this.badgesEl || this.reducedMotion) {
      return;
    }

    const badges = this.badgesEl.querySelectorAll(".hero-visual__badge--pass");
    badges.forEach((badge, index) => {
      badge.classList.remove("is-pulsing");
      void badge.offsetWidth;
      badge.style.setProperty("--pulse-delay", `${index * 120}ms`);
      badge.classList.add("is-pulsing");
    });
  };

  HeroVisualPlayer.prototype.run = async function () {
    if (this.statusEl) {
      this.statusEl.textContent = "reproducing";
    }

    for (const line of INTRO_LINES) {
      await this.typeLine(line);
      await sleep(LINE_PAUSE_MS);
    }

    this.showVerdict();

    let index = 0;
    while (true) {
      await this.waitWhilePaused();
      await this.typeLine(LOOP_LINES[index % LOOP_LINES.length]);
      this.pruneOldLines();
      await sleep(LINE_PAUSE_MS);
      index += 1;
    }
  };

  HeroVisualPlayer.prototype.pause = function () {
    this.paused = true;
  };

  HeroVisualPlayer.prototype.resume = function () {
    this.paused = false;
  };

  async function init() {
    const root = document.getElementById("heroVisual");
    const particles = document.getElementById("heroVisualParticles");
    if (!root || !particles) {
      return;
    }

    createParticles(particles, prefersReducedMotion() ? 8 : 22);
    await waitForLayout();

    const player = new HeroVisualPlayer(root);
    player.run();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        player.pause();
      } else {
        player.resume();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
