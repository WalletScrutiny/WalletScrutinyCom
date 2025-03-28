At WalletScrutiny, we evaluate Bitcoin custodians using a systematic approach that attempts to put a quantitative score on what is fundamentally a qualitative assessment. While self-custody remains the gold standard for Bitcoin security, we recognize that many users utilize custodial services. Our 100-point scoring system provides transparency into how we evaluate these services.

It's important to understand that our assessments focus on observable fundamentals and public information. **Even custodians scoring highly on our criteria can experience security incidents or operational failures that we cannot predict.** We don't have insider knowledge of internal processes, undisclosed vulnerabilities, or management decisions that may affect security. If you have relevant information about any custodian that isn't reflected in our assessment, we encourage you to share it through the nostr opinion plugin at the bottom of each custodian page. Your insights help the broader Bitcoin community make better-informed decisions.

## Our Evaluation Framework

We analyze custodians across five key dimensions, allocating points based on the completeness and quality of their security measures. This framework aims to provide a consistent methodology while acknowledging that turning qualitative assessments into quantitative scores has inherent limitations.

### 1. Key Management & Security (30 points)

<div class="textbox" style="background-color: rgba(173, 178, 212, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #5052a3; border-bottom: 2px solid #5052a3; padding-bottom: 5px; margin-bottom: 10px;">1.1 Hot Wallet and Cold Storage Design (10 points)</h4>

  <p>We assess whether the custodian publishes details about their hot/cold wallet infrastructure, which is critical for understanding how your Bitcoin is secured.</p>

  <ul>
    <li><strong>Published (10 points)</strong>: The custodian provides comprehensive, up-to-date documentation of their storage architecture, including specific technical details about how funds are segregated between hot and cold wallets.</li>
    <li><strong>Partial (5 points)</strong>: The custodian shares some information about their storage design but lacks sufficient technical detail or transparency.</li>
    <li><strong>Outdated (3 points)</strong>: Documentation exists but hasn't been updated within the last year, raising questions about its current accuracy.</li>
    <li><strong>None (0 points)</strong>: No information is provided about how funds are stored.</li>
  </ul>

  <p>The scoring considers: whether the design is published (5 pts), availability of supporting documentation URLs (2 pts), and the level of detail provided (3 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(199, 217, 221, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #2b7d8c; border-bottom: 2px solid #2b7d8c; padding-bottom: 5px; margin-bottom: 10px;">1.2 Multi-signature/MPC Implementation (10 points)</h4>

  <p>We evaluate the custodian's use of multi-signature or Multi-Party Computation (MPC) technology for securing private keys.</p>

  <ul>
    <li><strong>Comprehensive Implementation (10 points)</strong>: Clear documentation of multi-signature or MPC protocols with specific details about threshold requirements and security procedures.</li>
    <li><strong>Basic Implementation (5 points)</strong>: Evidence of multi-signature or MPC use, but with limited technical details.</li>
    <li><strong>Non-existent (0 points)</strong>: No evidence of multi-signature or MPC implementation.</li>
  </ul>

  <p>Points are awarded for: implementation of multi-signature/MPC technology (5 pts) and detailed documentation of the implementation process (5 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(213, 229, 213, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #3a7c3a; border-bottom: 2px solid #3a7c3a; padding-bottom: 5px; margin-bottom: 10px;">1.3 Hardware Security (10 points)</h4>

  <p>We assess the use of dedicated hardware security modules (HSMs) and other physical security measures.</p>

  <ul>
    <li><strong>Comprehensive (10 points)</strong>: Documented use of specific hardware security measures with clear information about implementation.</li>
    <li><strong>Basic (5 points)</strong>: General mentions of hardware security without specific details.</li>
    <li><strong>Non-existent (0 points)</strong>: No evidence of dedicated hardware security.</li>
  </ul>

  <p>The scoring evaluates: implementation of hardware security technology (5 pts) and specific details about the hardware being used (5 pts).</p>
  <p><em>Note: In practice, our scoring system looks for specific hardware-related terms (like "Cold Storage", "HSM", "Ledger", "Trezor") and implementation details rather than using these qualitative labels directly.</em></p>
</div>

### 2. Infrastructure & Operations (25 points)

<div class="textbox" style="background-color: rgba(238, 241, 218, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #7c7c39; border-bottom: 2px solid #7c7c39; padding-bottom: 5px; margin-bottom: 10px;">2.1 Security Certifications (10 points)</h4>

  <p>We check for relevant industry security certifications that indicate external validation of security practices.</p>

  <ul>
    <li><strong>Multiple Relevant Certifications (10 points)</strong>: The custodian holds several recognized security certifications.</li>
    <li><strong>Limited Certifications (3-6 points)</strong>: The custodian holds at least one recognized security certification.</li>
    <li><strong>No Certifications (0 points)</strong>: No evidence of security certifications.</li>
  </ul>

  <p>Points are awarded based on the number of certifications, with 3 points per certification up to a maximum of 10 points.</p>
</div>

<div class="textbox" style="background-color: rgba(173, 178, 212, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #5052a3; border-bottom: 2px solid #5052a3; padding-bottom: 5px; margin-bottom: 10px;">2.2 Security Audits (10 points)</h4>

  <p>We evaluate the custodian's history of security audits and their transparency regarding past security incidents.</p>

  <ul>
    <li><strong>Comprehensive (10 points)</strong>: Regular security audits with published results and transparent incident history.</li>
    <li><strong>Partial (5 points)</strong>: Some evidence of security audits without full transparency.</li>
    <li><strong>Non-existent (0 points)</strong>: No evidence of security audits.</li>
  </ul>

  <p>The scoring considers: availability of track record information (5 pts), transparency about incident history (3 pts), and insurance coverage (2 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(199, 217, 221, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #2b7d8c; border-bottom: 2px solid #2b7d8c; padding-bottom: 5px; margin-bottom: 10px;">2.3 Incident Response (5 points)</h4>

  <p>We assess the custodian's approach to handling security incidents and their track record in responding to issues.</p>

  <ul>
    <li><strong>Robust (5 points)</strong>: Clear documentation of incident response procedures with evidence of effective historical responses.</li>
    <li><strong>Partial (2-3 points)</strong>: Some information about incident response without comprehensive details.</li>
    <li><strong>Non-existent (0 points)</strong>: No information about incident response procedures.</li>
  </ul>

  <p>Points are awarded for: providing the date of the last security incident (2 pts) and maintaining a transparent incident history (3 pts).</p>
</div>

### 3. Transparency (20 points)

<div class="textbox" style="background-color: rgba(213, 229, 213, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #3a7c3a; border-bottom: 2px solid #3a7c3a; padding-bottom: 5px; margin-bottom: 10px;">3.1 Proof of Reserves (10 points)</h4>

  <p>We evaluate how the custodian verifies and proves that they possess the Bitcoin they claim to hold on behalf of customers.</p>

  <ul>
    <li><strong>Cryptographic Proof (10 points)</strong>: Regular cryptographic proof of reserves with user verification capabilities.</li>
    <li><strong>Traditional Audit (5 points)</strong>: Third-party audits of reserves without cryptographic verification.</li>
    <li><strong>Self-Reported (2 points)</strong>: Custodian self-reports reserves without external verification.</li>
    <li><strong>None (0 points)</strong>: No proof of reserves provided.</li>
  </ul>

  <p>The scoring considers: implementation of proof of reserves (5 pts), availability of verification URLs (2 pts), regular frequency of proofs (2 pts), and recency of the last proof (1 pt).</p>
</div>

<div class="textbox" style="background-color: rgba(238, 241, 218, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #7c7c39; border-bottom: 2px solid #7c7c39; padding-bottom: 5px; margin-bottom: 10px;">3.2 Documentation (5 points)</h4>

  <p>We assess the quality and comprehensiveness of the custodian's business documentation.</p>

  <ul>
    <li><strong>Comprehensive (5 points)</strong>: Clear, detailed documentation about business model and services.</li>
    <li><strong>Partial (2-3 points)</strong>: Some business documentation without comprehensive details.</li>
    <li><strong>Non-existent (0 points)</strong>: Minimal or no business documentation.</li>
  </ul>

  <p>Points are awarded for: clearly defined business model type (2 pts) and comprehensive documentation of services offered (3 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(173, 178, 212, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #5052a3; border-bottom: 2px solid #5052a3; padding-bottom: 5px; margin-bottom: 10px;">3.3 Open Source Contributions (5 points)</h4>

  <p>We evaluate the custodian's contributions to Bitcoin's open source ecosystem.</p>

  <ul>
    <li><strong>Active Contributor (5 points)</strong>: Significant contributions to Bitcoin's open source development, research, or protocol support.</li>
    <li><strong>Limited Contributions (1-4 points)</strong>: Some contributions to the Bitcoin ecosystem.</li>
    <li><strong>No Contributions (0 points)</strong>: No evidence of contributions to Bitcoin's open source ecosystem.</li>
  </ul>

  <p>The scoring considers: contributions to FOSS development (2 pts), Bitcoin protocol support (2 pts), and Bitcoin-related research (1 pt).</p>
</div>

### 4. Regulatory Compliance (15 points)

<div class="textbox" style="background-color: rgba(199, 217, 221, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #2b7d8c; border-bottom: 2px solid #2b7d8c; padding-bottom: 5px; margin-bottom: 10px;">4.1 Licensing (10 points)</h4>

  <p>We assess the custodian's regulatory status and leadership transparency.</p>

  <ul>
    <li><strong>Comprehensive (10 points)</strong>: Clear regulatory licensing with transparent information about jurisdiction and leadership.</li>
    <li><strong>Partial (5 points)</strong>: Some regulatory information without comprehensive details.</li>
    <li><strong>Non-existent (0 points)</strong>: No information about regulatory compliance.</li>
  </ul>

  <p>Points are awarded for: clear jurisdiction information (5 pts), established business history (3 pts), and transparent leadership team information (2 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(213, 229, 213, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #3a7c3a; border-bottom: 2px solid #3a7c3a; padding-bottom: 5px; margin-bottom: 10px;">4.2 Compliance Programs (5 points)</h4>

  <p>We evaluate the custodian's approach to regulatory compliance programs.</p>

  <ul>
    <li><strong>Robust (5 points)</strong>: Clear documentation of comprehensive compliance programs.</li>
    <li><strong>Partial (2 points)</strong>: Some information about compliance programs without comprehensive details.</li>
    <li><strong>Non-existent (0 points)</strong>: No information about compliance programs.</li>
  </ul>

  <p>Points are awarded for: a business model that supports compliance (2 pts) and clear information about country restrictions (3 pts).</p>
</div>

### 5. User Security Features (10 points)

<div class="textbox" style="background-color: rgba(238, 241, 218, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #7c7c39; border-bottom: 2px solid #7c7c39; padding-bottom: 5px; margin-bottom: 10px;">5.1 Authentication (5 points)</h4>

  <p>We assess the security of user authentication mechanisms.</p>

  <ul>
    <li><strong>Robust (5 points)</strong>: Support for strong authentication methods including 2FA and advanced options.</li>
    <li><strong>Basic (3 points)</strong>: Basic authentication security without advanced options.</li>
    <li><strong>Weak (0 points)</strong>: Limited authentication security.</li>
  </ul>

  <p>The scoring considers: support for 2FA (3 pts) and implementation of advanced authentication methods like biometrics or FIDO2 (2 pts).</p>
</div>

<div class="textbox" style="background-color: rgba(173, 178, 212, 0.3); padding: 15px; margin-bottom: 15px; border-radius: 5px;">
  <h4 style="color: #5052a3; border-bottom: 2px solid #5052a3; padding-bottom: 5px; margin-bottom: 10px;">5.2 Transaction Security (5 points)</h4>

  <p>We evaluate the security measures in place for transaction processing.</p>

  <ul>
    <li><strong>Comprehensive (5 points)</strong>: Multiple transaction security features including withdrawal confirmations, address whitelisting, and withdrawal limits.</li>
    <li><strong>Partial (2-3 points)</strong>: Some transaction security features without comprehensive coverage.</li>
    <li><strong>Basic (0 points)</strong>: Minimal transaction security features.</li>
  </ul>

  <p>Points are awarded for: withdrawal confirmation requirements (2 pts), address whitelisting support (2 pts), and implementation of withdrawal limits (1 pt).</p>
</div>

## Scoring Summary

Our 100-point scoring system is distributed across five key dimensions, each containing specific evaluation criteria. The table below provides a comprehensive breakdown of how points are allocated:

### 1. Key Management & Security (30 points)

| Subcategory | Max Points | Scoring Breakdown |
|-------------|------------|-------------------|
| **Hot/Cold Wallet Design** | 10 | • **Published (10 pts)**: Comprehensive, up-to-date documentation<br>• **Partial (5 pts)**: Some information but lacks detail<br>• **Outdated (3 pts)**: Documentation not updated within a year<br>• **None (0 pts)**: No information provided |
| **Multi-signature/MPC** | 10 | • **Comprehensive (10 pts)**: Detailed implementation documentation<br>• **Basic (5 pts)**: Evidence of use with limited details<br>• **None (0 pts)**: No evidence of implementation |
| **Hardware Security** | 10 | • **Comprehensive (10 pts)**: Documented use with implementation details<br>• **Basic (5 pts)**: General mentions without specifics<br>• **None (0 pts)**: No evidence of hardware security |

### 2. Infrastructure & Operations (25 points)

| Subcategory | Max Points | Scoring Breakdown |
|-------------|------------|-------------------|
| **Security Certifications** | 10 | • **Multiple Certifications (10 pts)**: Several recognized certifications<br>• **Limited (3-6 pts)**: At least one certification (3 pts per certification)<br>• **None (0 pts)**: No certifications |
| **Security Audits** | 10 | • **Comprehensive (10 pts)**: Regular audits with published results<br>• **Partial (5 pts)**: Some evidence without full transparency<br>• **None (0 pts)**: No evidence of security audits |
| **Incident Response** | 5 | • **Robust (5 pts)**: Clear documentation with historical evidence<br>• **Partial (2-3 pts)**: Some information without comprehensive details<br>• **None (0 pts)**: No information about incident response |

### 3. Transparency (20 points)

| Subcategory | Max Points | Scoring Breakdown |
|-------------|------------|-------------------|
| **Proof of Reserves** | 10 | • **Cryptographic Proof (10 pts)**: Regular proof with user verification<br>• **Traditional Audit (5 pts)**: Third-party audits without cryptographic verification<br>• **Self-Reported (2 pts)**: Self-reported without external verification<br>• **None (0 pts)**: No proof provided |
| **Documentation** | 5 | • **Comprehensive (5 pts)**: Clear, detailed business documentation<br>• **Partial (2-3 pts)**: Some documentation without comprehensive details<br>• **None (0 pts)**: Minimal or no documentation |
| **Open Source Contributions** | 5 | • **Active (5 pts)**: Significant contributions to Bitcoin ecosystem<br>• **Limited (1-4 pts)**: Some contributions<br>• **None (0 pts)**: No evidence of contributions |

### 4. Regulatory Compliance (15 points)

| Subcategory | Max Points | Scoring Breakdown |
|-------------|------------|-------------------|
| **Licensing** | 10 | • **Comprehensive (10 pts)**: Clear regulatory status and transparent leadership<br>• **Partial (5 pts)**: Some regulatory information without comprehensive details<br>• **None (0 pts)**: No regulatory information |
| **Compliance Programs** | 5 | • **Robust (5 pts)**: Clear documentation of compliance programs<br>• **Partial (2 pts)**: Some information without comprehensive details<br>• **None (0 pts)**: No information about compliance programs |

### 5. User Security Features (10 points)

| Subcategory | Max Points | Scoring Breakdown |
|-------------|------------|-------------------|
| **Authentication** | 5 | • **Robust (5 pts)**: Strong authentication including 2FA and advanced options<br>• **Basic (3 pts)**: Basic authentication without advanced options<br>• **Weak (0 pts)**: Limited authentication security |
| **Transaction Security** | 5 | • **Comprehensive (5 pts)**: Multiple security features for transactions<br>• **Partial (2-3 pts)**: Some features without comprehensive coverage<br>• **Basic (0 pts)**: Minimal transaction security features |

**TOTAL POSSIBLE SCORE: 100 POINTS**

Remember that this scoring system attempts to put a quantitative approach on a qualitative matter. The scores should be viewed as a starting point for assessment, not as an absolute measure of security or trustworthiness. Always conduct your own research before choosing a Bitcoin custodian.
