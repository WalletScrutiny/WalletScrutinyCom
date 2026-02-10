# eCash Verdict Analysis for WalletScrutiny

**Date:** 2026-02-09
**Author:** Heisenberg
**Status:** Draft for review

---

## The Problem

Chaumian eCash (Cashu, Fedimint) presents a categorization challenge:

1. **Verdicts are mutually exclusive** — a product gets ONE verdict
2. **eCash involves custody** — but it's nuanced (Uncle Jim ≠ FTX)
3. **Products mix roles** — some are clients, some are mints, some are both
4. **Source matters** — even for custodial clients, reproducibility aids security

Current system: `ecash` verdict is a red-flag that **stops analysis**, treating it like `custodial`. This loses valuable information.

---

## Product Categories Identified

### 1. Pure eCash Clients (Cashu.me, Nutstash)
- **What they are:** Web/mobile apps that connect to mints
- **Custody model:** User trusts mint operator
- **Current verdict:** `sourceavailable` (on feature branch)
- **Problem:** No indication they're custodial!

### 2. Mint Software (Nutshell, LNbits with Cashu extension)
- **What they are:** Software to RUN a mint (self-hosted)
- **Custody model:** Operator controls Lightning funds (self-custodial for operator)
- **Current verdict:** `sourceavailable`
- **This is correct** — but should be distinguished from clients

### 3. Hybrid Products (Nutshell)
- **What they are:** Both client AND mint in one package
- **Custody model:** Depends on how you use it
- **Problem:** Single verdict can't capture this

### 4. Wallets with Optional eCash (future: Zeus, Breez, etc.)
- **What they are:** Self-custodial LN wallets that CAN connect to mints
- **Custody model:** Mixed — self-custodial for LN, custodial for ecash
- **Problem:** How do we represent "optional custody"?

---

## The Zeus Analogy

Leo's insight: Zeus connecting to user's own LN node ≈ Cashu client connecting to user's own mint.

| Product | Controls Own Backend | Connects to Third Party |
|---------|---------------------|------------------------|
| Zeus | Self-custodial (own node) | Custodial (someone else's node) |
| Cashu client | Self-custodial (own mint) | Custodial (someone else's mint) |

**Key insight:** The CLIENT software is the same. Custody depends on DEPLOYMENT, not code.

---

## What WalletScrutiny Should Communicate

For eCash **clients**, users need to know:

1. ✅ Is the code open source? (Can I audit what I'm running?)
2. ✅ Is it reproducible? (Am I running what I think I'm running?)
3. ⚠️ This involves trusting a mint (custody warning)
4. 💡 You CAN run your own mint (escape hatch)

For eCash **mints**, users need to know:

1. ✅ Is the code open source?
2. ✅ Is it reproducible?
3. ✅ Running this = self-custody of the Lightning funds
4. ⚠️ YOUR users trust YOU (responsibility warning)

---

## Proposed Solution: Feature + Warning, Not Verdict

### Option A: Keep `ecash` as Verdict (Current Structure)

**Problem:** Stops analysis at custody check, loses reproducibility info.

```
ecash verdict → Analysis stops → No build verification
```

### Option B: Remove `ecash` Verdict, Use Features + Warning

**Approach:** 
- Treat eCash clients like other custodial-ish products
- Use `features: [cashu]` or `features: [fedimint]`
- Add prominent warning in template when feature present
- Allow full verdict progression (wip → sourceavailable → reproducible)

```yaml
# Cashu.me - a client
verdict: sourceavailable
features:
  - cashu
  - ln
```

The template shows:
- ✅ Source available
- ⚠️ **eCash Warning:** This wallet connects to Cashu mints. Your funds are held by the mint operator...

**Benefit:** Users get BOTH pieces of information:
1. Code quality/verifiability
2. Custody model

### Option C: Split Verdict into Sub-Types

```yaml
# New verdict structure
verdict: ecash-client-sourceavailable
# or
verdict: ecash-mint-sourceavailable
```

**Problem:** Explosion of verdict combinations, breaks existing structure.

---

## Recommended Approach: Option B

### Implementation Steps

1. **Remove `ecash` from verdict lists in `platformMeta.yml`**
   - Products won't get stuck at ecash check
   - They proceed to nosource/sourceavailable/reproducible

2. **Keep `cashu` and `fedimint` as features** (already exist)
   - Add them to products that support these protocols

3. **Add new feature: `ecash-mint`**
   - Distinguishes "runs a mint" from "connects to mints"
   
4. **Modify templates to show custody warning**
   - When `features` contains `cashu` or `fedimint`
   - Display prominent warning about mint trust
   - Link to explanation of eCash custody model

5. **Add "escape hatch" messaging**
   - For clients: "You can mitigate this by running your own mint"
   - For mints: "If you run this, YOU become the custodian"

### Example Product Configurations

```yaml
# Cashu.me - Web client
verdict: sourceavailable
features: [cashu, ln]
# Template shows: ⚠️ eCash client - trusts mint operator

# Nutshell - Mint + Client
verdict: sourceavailable
features: [cashu, ln, ecash-mint]
# Template shows: This is mint software. Running it = self-custody.

# Nutstash - Web client
verdict: sourceavailable  
features: [cashu, ln, nostr]
# Template shows: ⚠️ eCash client - trusts mint operator

# LNbits - Self-hosted LN accounts (can run Cashu extension)
verdict: sourceavailable
features: [ln]
# No ecash feature unless Cashu extension documented
```

---

## Template Changes Required

### In `_includes/review/` or wallet template:

```liquid
{% if page.features contains 'cashu' or page.features contains 'fedimint' %}
<div class="ecash-warning">
  <h3>⚠️ Chaumian eCash</h3>
  {% if page.features contains 'ecash-mint' %}
    <p><strong>This is mint software.</strong> Running your own mint means 
    YOU control the underlying Bitcoin/Lightning funds. Your users will 
    trust you as their custodian.</p>
  {% else %}
    <p><strong>This wallet connects to eCash mints.</strong> Your tokens 
    are held by the mint operator. This provides excellent privacy but 
    requires trusting your mint.</p>
    <p>Consider: Run your own mint, or use a mint operated by someone 
    you know and can reach ("Uncle Jim").</p>
  {% endif %}
</div>
{% endif %}
```

---

## Why This Matters for Bitcoin

Leo's point about coin taint is crucial. eCash provides:

- **Privacy:** Blind signatures mean mint can't track token flows
- **Fungibility:** Breaks chain analysis heuristics
- **Accessibility:** Simpler UX than channel management

WalletScrutiny supporting eCash properly means:

1. Users can find **audited, reproducible** eCash clients
2. "Uncle Jims" can find **verified mint software** to serve their communities
3. The ecosystem moves toward **transparent custody** (even if still custody)

This is harm reduction, not endorsement of custody.

---

## Open Questions

1. **Should `ecash` verdict be removed entirely?**
   - Pro: Cleaner, features handle it
   - Con: Loses ability to STOP analysis for truly sketchy products

2. **How to handle wallets with OPTIONAL ecash?**
   - e.g., Phoenix adds Cashu support
   - Verdict stays based on main functionality?
   - Feature indicates optional ecash?

3. **Should we verify eCash PROTOCOL compliance?**
   - NUT (Notation, Usage, Terminology) compliance
   - Interoperability testing
   - Out of scope for now?

4. **What about Fedimint federation verification?**
   - More complex than single-mint Cashu
   - Federation setup is operational, not code
   - Probably features-only, no special verdict

---

## Next Steps

1. [ ] Decide: Remove `ecash` verdict or keep as fallback?
2. [ ] Add `ecash-mint` feature to `features.yml`
3. [ ] Update templates with eCash warning blocks
4. [ ] Review products on `add-ten-wallets2` branch for correct features
5. [ ] Document in methodology page

---

## Summary

| Product Type | Verdict | Features | Template Shows |
|-------------|---------|----------|----------------|
| Pure client | sourceavailable/reproducible | cashu/fedimint | ⚠️ Custody warning |
| Pure mint | sourceavailable/reproducible | cashu, ecash-mint | ℹ️ "You are the custodian" |
| Hybrid | sourceavailable/reproducible | cashu, ecash-mint | Both messages |
| Wallet + optional ecash | (main verdict) | cashu | ⚠️ Optional feature warning |

The key shift: **Custody model becomes a feature/warning, not a verdict.** 
This lets WalletScrutiny evaluate code quality while still communicating trust requirements.
