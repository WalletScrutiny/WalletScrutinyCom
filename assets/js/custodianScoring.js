
class CustodianScore {
  constructor(custodian) {
    this.custodian = custodian;
    this.debugLog = [];
    this.scoresCalculated = false;
    this._totalScore = 0;
    
    // Initialize data structure for scoring
    this.data = {
      keyManagement: {
        maxScore: 30,
        score: 0,
        items: {
          coldStorage: { score: 0, maxScore: 10 },
          multiSig: { score: 0, maxScore: 10 },
          hardware: { score: 0, maxScore: 10 }
        }
      },
      infrastructure: {
        maxScore: 25,
        score: 0,
        items: {
          certifications: { score: 0, maxScore: 10 },
          audits: { score: 0, maxScore: 10 },
          incidentResponse: { score: 0, maxScore: 5 }
        }
      },
      transparency: {
        maxScore: 20,
        score: 0,
        items: {
          proofOfReserves: { score: 0, maxScore: 10 },
          documentation: { score: 0, maxScore: 5 },
          openSource: { score: 0, maxScore: 5 }
        }
      },
      compliance: {
        maxScore: 15,
        score: 0,
        items: {
          licensing: { score: 0, maxScore: 10 },
          compliancePrograms: { score: 0, maxScore: 5 }
        }
      },
      userSecurity: {
        maxScore: 10,
        score: 0,
        items: {
          authentication: { score: 0, maxScore: 5 },
          transactionSecurity: { score: 0, maxScore: 5 }
        }
      }
    };
  }
  
  // Helper method to log scoring events
  logScore(category, item, points, reason) {
    // Only log if points is a valid number
    if (typeof points === 'number') {
      this.debugLog.push({
        category,
        item,
        points,
        reason,
        timestamp: new Date().toISOString()
      });
      const sign = points >= 0 ? '+' : '';
      console.log(`[SCORE] ${category} > ${item}: ${sign}${points} points (${reason})`);
    } else {
      console.warn(`[SCORE WARNING] Invalid points value for ${category} > ${item}: ${points}`);
    }
  }

  calculateAllScores() {
    return {
      keyManagement: {
        maxScore: 30,
        items: {
          coldStorage: this.calculateColdStorageScore(),
          multiSig: this.calculateMultiSigScore(),
          hardware: this.calculateHardwareScore()
        }
      },
      infrastructure: {
        maxScore: 25,
        items: {
          certifications: this.calculateCertificationsScore(),
          audits: this.calculateAuditsScore(),
          incidentResponse: this.calculateIncidentResponseScore()
        }
      },
      transparency: {
        maxScore: 20,
        items: {
          proofOfReserves: this.calculateProofOfReservesScore(),
          documentation: this.calculateDocumentationScore(),
          openSource: this.calculateOpenSourceScore()
        }
      },
      compliance: {
        maxScore: 15,
        items: {
          licensing: this.calculateLicensingScore(),
          compliancePrograms: this.calculateComplianceProgramsScore()
        }
      },
      userSecurity: {
        maxScore: 10,
        items: {
          authentication: this.calculateAuthenticationScore(),
          transactionSecurity: this.calculateTransactionSecurityScore()
        }
      }
    };
  }

  calculateColdStorageScore() {
    // # 1 Key Management & Security
    // ## 1.1 Hot Wallet and Cold Storage Design (10 points)
    let score = 0;
    const maxScore = 10;
    const hotCold = this.custodian.hotColdDesign || {};
    
    // Add 5 points if design is published or status is published
    if (hotCold.published || hotCold.status === 'published') {
      score += 5;
      this.logScore('keyManagement', 'coldStorage', 5, 'Design is published');
    }
    // Add 3 points if status is outdated
    else if (hotCold.status === 'outdated') {
      score += 3;
      this.logScore('keyManagement', 'coldStorage', 3, 'Design is outdated');
    }
    // Add 5 points if status is partial
    else if (hotCold.status === 'partial') {
      score += 5;
      this.logScore('keyManagement', 'coldStorage', 5, 'Design is partially published');
    }
    
    // Add 2 points if documentation URL exists
    if (hotCold.documentation_url || hotCold.supporting_urls) {
      score += 2;
      this.logScore('keyManagement', 'coldStorage', 2, 'Documentation URL provided');
    }
    
    // Add 3 points if details are provided
    if (hotCold.details && hotCold.details.length > 0) {
      score += 3;
      this.logScore('keyManagement', 'coldStorage', 3, 'Implementation details provided');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('keyManagement', 'coldStorage', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateProofOfReservesScore() {
    // # 3 Transparency
    // ## 3.1 Proof of Reserves (10 points)
    let score = 0;
    const maxScore = 10;
    const por = this.custodian.proofOfReserves || {};
    const ops = this.custodian.operations || {};
    
    // Check if proof of reserves is supported (either directly, via status field, or traditional audit)
    if (por.supported || 
        por.status === 'cryptographic' || 
        por.status === 'supported' || 
        por.status === 'traditional-audit') {
      score += 5;
      this.logScore('transparency', 'proofOfReserves', 5, 'Proof of reserves or traditional audit supported');
    }
    
    // Check for verification URL (either directly, via auditUrl field, or thirdPartyAudit)
    if (por.verificationUrl || por.auditUrl || 
        (ops.thirdPartyAudit && ops.thirdPartyAudit.sourceUrl)) {
      score += 2;
      this.logScore('transparency', 'proofOfReserves', 2, 'Verification URL provided');
    }
    
    // Check for frequency information (either directly or via auditFrequency field)
    if (por.frequency || por.auditFrequency) {
      score += 2;
      this.logScore('transparency', 'proofOfReserves', 2, 'Regular frequency of proofs');
    }
    
    // Check for last proof date (either directly, via lastAudit field, or thirdPartyAudit)
    if (por.lastProof || por.lastAudit || 
        (ops.thirdPartyAudit && ops.thirdPartyAudit.lastUpdated)) {
      score += 1;
      this.logScore('transparency', 'proofOfReserves', 1, 'Recent proof or audit available');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('transparency', 'proofOfReserves', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateMultiSigScore() {
    // # 1 Key Management & Security
    // ## 1.2 Multi-signature/MPC Implementation (10 points)
    let score = 0;
    const maxScore = 10;
    const multiSig = this.custodian.multiSig || {};
    const security = this.custodian.security || {};
    const hotCold = this.custodian.hotColdDesign || {};
    
    // Check if multi-signature or MPC/TSS is supported (from multiple possible locations)
    if (multiSig.supported || 
        (security.features && security.features.includes('Multi-signature Wallets')) ||
        (hotCold.details && (hotCold.details.includes('multi-signature') || 
                           hotCold.details.includes('multi-sig') || 
                           hotCold.details.includes('multisig') ||
                           hotCold.details.includes('TSS') ||
                           hotCold.details.includes('Threshold Signing') ||
                           hotCold.details.includes('MPC')))) {
      score += 5;
      this.logScore('keyManagement', 'multiSig', 5, 'Multi-signature/MPC/TSS is supported');
    }
    
    // Check for implementation details (from multiple possible locations)
    if ((multiSig.details && multiSig.details.length > 0) || 
        (security.details && security.details.includes('Multisignature Authorization')) ||
        (hotCold.details && hotCold.details.length > 50) ||
        (hotCold.analysis && hotCold.analysis.length > 50)) {
      score += 5;
      this.logScore('keyManagement', 'multiSig', 5, 'Implementation details provided');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('keyManagement', 'multiSig', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateHardwareScore() {
    // # 1 Key Management & Security
    // ## 1.3 Hardware Security (10 points)
    // Note: While methodology uses terms "Comprehensive/Basic/Non-existent", the code implements
    // this through specific conditions checking for the same levels of detail: basic mentions (+5 pts)
    // and specific implementation details (+5 pts) as described in the methodology.
    let score = 0;
    const maxScore = 10;
    const hardware = this.custodian.hardwareWallets || {};
    const security = this.custodian.security || {};
    const hotCold = this.custodian.hotColdDesign || {};
    
    // Check if hardware security is supported (from multiple possible locations)
    if (hardware.supported || 
        (security.features && security.features.includes('Cold Storage')) || 
        (security.details && (security.details.includes('Hardware Wallets') || 
                             security.details.includes('HSM'))) ||
        (hotCold.details && (hotCold.details.includes('HSM') || 
                           hotCold.details.includes('Hardware Security Module') ||
                           hotCold.details.includes('cold storage') ||
                           hotCold.details.includes('air-gapped')))) {
      score += 5;
      this.logScore('keyManagement', 'hardware', 5, 'Hardware security is supported');
    }
    
    // Check for specific hardware details (from multiple possible locations)
    if ((hardware.models && hardware.models.length > 0) || 
        (security.details && (security.details.includes('Ledger') || 
                             security.details.includes('Trezor') ||
                             security.details.includes('HSM'))) ||
        (security.customInfrastructure === true) ||
        (hotCold.details && (hotCold.details.includes('HSM') ||
                           hotCold.details.includes('Hardware Security Module')))) {
      score += 5;
      this.logScore('keyManagement', 'hardware', 5, 'Specific hardware security details provided');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('keyManagement', 'hardware', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateCertificationsScore() {
    // # 2 Infrastructure & Operations
    // ## 2.1 Security Certifications (10 points)
    // This function implements the methodology rating:
    // - Multiple Certifications (10 pts): Several recognized certifications
    // - Limited (3-6 pts): At least one certification (3 pts per certification)
    // - None (0 pts): No certifications
    let score = 0;
    const maxScore = 10;
    // Get certifications from custodian data (either at top level or in security section) or default to empty array
    const certifications = this.custodian.certifications || 
                          (this.custodian.security && this.custodian.security.certifications) || 
                          [];
    
    if (certifications && certifications.length > 0) {
      // Award points based on the number of certifications (up to max)
      // Each certification is worth 3 points, with a cap at 10 points (requires 4+ certifications for max)
      // Note: No validation is performed on certification values - any string in the array counts as valid
      const certPoints = Math.min(certifications.length * 3, 10);
      score += certPoints;
      this.logScore('infrastructure', 'certifications', certPoints, `${certifications.length} certifications provided`);
    }
    // Note: Common certifications include SOC 2, ISO 27001, PCI DSS
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('infrastructure', 'certifications', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateAuditsScore() {
    // # 2 Infrastructure & Operations
    // ## 2.2 Security Audits (10 points)
    // This function implements the methodology rating:
    // - Comprehensive (10 pts): Regular security audits with published results and transparency
    // - Partial (5 pts): Some evidence of security audits without full transparency
    // - Non-existent (0 pts): No evidence of security audits
    // 
    // The scoring considers three components, totaling 10 points:
    // 1. Evidence security audits are performed (5 pts)
    // 2. Transparency with published reports (3 pts)
    // 3. Insurance coverage (2 pts)
    let score = 0;
    const maxScore = 10;
    
    // Check both new and legacy fields for backward compatibility
    const securitySection = this.custodian.security || {};
    const securityAudits = securitySection.securityAudits || {};
    const ops = this.custodian.operations || {};
    const trackRecord = this.custodian.trackRecord || {};
    
    // Check if security audits are performed (5 pts)
    // First check new field, then fall back to legacy fields if needed
    if (securityAudits.performed || securityAudits.frequency || securityAudits.lastAuditDate ||
        (securityAudits.auditReports && securityAudits.auditReports.length > 0) ||
        ops.trackRecord || trackRecord.history) {
      score += 5;
      this.logScore('infrastructure', 'audits', 5, 'Security audits performed');
    }
    
    // Check for published audit reports (3 pts)
    if ((securityAudits.auditReports && securityAudits.auditReports.length > 0 && 
         securityAudits.auditReports.some(report => report.url)) ||
        ops.securityAuditUrl) {
      score += 3;
      this.logScore('infrastructure', 'audits', 3, 'Published audit reports');
    }
    
    // Check for insurance coverage (2 pts) - still relevant for security audits
    if (securityAudits.insuranceCoverage || ops.insuranceCoverage || trackRecord.insuranceCoverage) {
      score += 2;
      this.logScore('infrastructure', 'audits', 2, 'Insurance coverage in place');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('infrastructure', 'audits', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateIncidentResponseScore() {
    // # 2 Infrastructure & Operations
    // ## 2.3 Incident Response (5 points)
    let score = 0;
    const maxScore = 5;
    const ops = this.custodian.operations || {};
    const trackRecord = this.custodian.trackRecord || {};
    
    // Check for last incident date (either in operations or directly in trackRecord)
    if (ops.lastIncident || trackRecord.lastIncident) {
      score += 2;
      this.logScore('infrastructure', 'incidentResponse', 2, 'Last incident date provided');
    }
    
    // Check for incident history (either in operations or directly in trackRecord)
    if (ops.incidentHistory || (trackRecord.incidentHistory && trackRecord.incidentHistory.length > 0)) {
      score += 3;
      this.logScore('infrastructure', 'incidentResponse', 3, 'Transparent incident history');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('infrastructure', 'incidentResponse', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateDocumentationScore() {
    // # 3 Transparency
    // ## 3.2 Documentation (5 points)
    let score = 0;
    const maxScore = 5;
    const model = this.custodian.businessModel || {};
    
    // Check if business model type is defined
    if (model.type) {
      score += 2;
      this.logScore('transparency', 'documentation', 2, 'Business model type defined');
    }
    
    // Check if services are documented
    if (model.services && model.services.length > 0) {
      score += 3;
      this.logScore('transparency', 'documentation', 3, 'Services clearly documented');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('transparency', 'documentation', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateOpenSourceScore() {
    // # 3 Transparency
    // ## 3.3 Open Source Contributions (5 points)
    let score = 0;
    const maxScore = 5;
    const contrib = this.custodian.bitcoinContribution || {};
    
    if (contrib.fossDevelopment) {
      score += 2;
      this.logScore('transparency', 'openSource', 2, 'Contributes to FOSS development');
    }
    
    if (contrib.protocolSupport) {
      score += 2;
      this.logScore('transparency', 'openSource', 2, 'Supports Bitcoin protocol development');
    }
    
    if (contrib.research) {
      score += 1;
      this.logScore('transparency', 'openSource', 1, 'Conducts or sponsors research');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('transparency', 'openSource', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateLicensingScore() {
    // # 4 Compliance
    // ## 4.1 Licensing (10 points)
    let score = 0;
    const maxScore = 10;
    const leadership = this.custodian.leadership || {};
    
    // Check if jurisdiction is established
    if (leadership.jurisdiction) {
      score += 5;
      this.logScore('compliance', 'licensing', 5, 'Clear jurisdiction established');
    }
    
    // Check for years in business (either directly or calculated from tenure)
    if (leadership.yearsInBusiness || 
        (leadership.ceo && leadership.ceo.tenure && leadership.ceo.tenure.includes('-'))) {
      score += 3;
      this.logScore('compliance', 'licensing', 3, 'Established business history');
    }
    
    // Check for transparent leadership team
    if ((leadership.team && leadership.team.length > 0) || 
        (leadership.ceo && leadership.ceo.name)) {
      score += 2;
      this.logScore('compliance', 'licensing', 2, 'Transparent leadership team');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('compliance', 'licensing', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateComplianceProgramsScore() {
    // # 4 Compliance
    // ## 4.2 Compliance Programs (5 points)
    let score = 0;
    const maxScore = 5;
    const model = this.custodian.businessModel || {};
    
    if (model.type) {
      score += 2;
      this.logScore('compliance', 'compliancePrograms', 2, 'Business model supports compliance');
    }
    
    if (model.restrictedCountries && Array.isArray(model.restrictedCountries) && model.restrictedCountries.length > 0) {
      score += 3;
      this.logScore('compliance', 'compliancePrograms', 3, 'Complies with country restrictions');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('compliance', 'compliancePrograms', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateAuthenticationScore() {
    // # 5 User Security
    // ## 5.1 Authentication (5 points)
    let score = 0;
    const maxScore = 5;
    const security = this.custodian.security || {};
    
    // Check for 2FA support (either directly or in features list)
    if (security.twoFactor || 
        (security.features && (security.features.includes('2FA') || 
                             security.features.includes('FIDO2')))) {
      score += 3;
      this.logScore('userSecurity', 'authentication', 3, '2FA supported');
    }
    
    // Check for biometric or advanced authentication
    if (security.biometric || 
        (security.features && (security.features.includes('Biometric') || 
                             security.features.includes('FIDO2')))) {
      score += 2;
      this.logScore('userSecurity', 'authentication', 2, 'Advanced authentication supported');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('userSecurity', 'authentication', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateTransactionSecurityScore() {
    // # 5 User Security
    // ## 5.2 Transaction Security (5 points)
    let score = 0;
    const maxScore = 5;
    const security = this.custodian.security || {};
    const userAccess = this.custodian.userAccess || {};
    
    // Check for withdrawal confirmations (from multiple possible locations)
    if (security.withdrawalConfirmations || 
        (security.features && (security.features.includes('Withdrawal Confirmations') || 
                             security.features.includes('2FA')))) {
      score += 2;
      this.logScore('userSecurity', 'transactionSecurity', 2, 'Withdrawal confirmations required');
    }
    
    // Check for address whitelisting (from multiple possible locations)
    if (security.addressWhitelisting || 
        (security.features && (security.features.includes('Withdrawal Whitelisting') || 
                             security.features.includes('Whitelisting')))) {
      score += 2;
      this.logScore('userSecurity', 'transactionSecurity', 2, 'Address whitelisting supported');
    }
    
    // Check for withdrawal limits (from multiple possible locations)
    if (security.withdrawalLimits || 
        (userAccess.withdrawalLimits && userAccess.withdrawalLimits.status) ||
        userAccess.kycRequired === true) {
      score += 1;
      this.logScore('userSecurity', 'transactionSecurity', 1, 'Withdrawal limits supported');
    }
    
    // Ensure score doesn't exceed maxScore
    const originalScore = score;
    score = Math.min(score, maxScore);
    
    if (originalScore > maxScore) {
      this.logScore('userSecurity', 'transactionSecurity', (originalScore - score) * -1, 'Score capped at maximum');
    }
    
    return { score, maxScore };
  }

  calculateCategoryScore(category) {
    let categoryScore = 0;
    let categoryId = '';
    
    // Find the category ID by checking the data object
    for (const [id, cat] of Object.entries(this.data)) {
      if (cat === category) {
        categoryId = id;
        break;
      }
    }
    
    // Log each item score for debugging
    console.log(`Calculating score for category: ${categoryId}`);
    Object.entries(category.items).forEach(([itemId, item]) => {
      console.log(`  - Item ${itemId}: score=${item.score}, maxScore=${item.maxScore}`);
    });
    
    // Sum up all item scores in this category
    Object.entries(category.items).forEach(([itemId, item]) => {
      // Make sure we're only adding valid scores
      if (item && typeof item.score === 'number') {
        categoryScore += item.score;
        this.logScore(categoryId, 'categoryTotal', item.score, `Added from ${itemId}`);
      } else {
        console.warn(`Invalid score for ${categoryId}.${itemId}: ${item?.score}`);
      }
    });
    
    // Ensure category score doesn't exceed maxScore
    const originalScore = categoryScore;
    categoryScore = Math.min(categoryScore, category.maxScore);
    
    if (originalScore > category.maxScore) {
      this.logScore(categoryId, 'categoryTotal', (originalScore - categoryScore) * -1, 'Category score capped at maximum');
    }
    
    // Store the score in the category object for later use
    category.score = categoryScore;
    console.log(`Final score for ${categoryId}: ${categoryScore}/${category.maxScore}`);
    
    return categoryScore;
  }

  calculateTotalScore() {
    // Force recalculation every time
    this.scoresCalculated = false;
    
    // Only calculate scores if they haven't been calculated yet or if we're forcing a recalculation
    if (!this.scoresCalculated) {
      // Clear previous debug logs when recalculating the total score
      this.debugLog = [];
      console.log('Recalculating all scores...');
      
      // CRITICAL: Ensure category max scores are set correctly
      // This is a safeguard in case data was loaded incorrectly
      this.data.transparency.maxScore = 20; // Should be 20 (10 + 5 + 5)
      
      // STEP 1: Calculate all individual item scores
      // Key Management scores
      const coldStorageResult = this.calculateColdStorageScore();
      const multiSigResult = this.calculateMultiSigScore();
      const hardwareResult = this.calculateHardwareScore();
      
      // Transparency scores
      const proofOfReservesResult = this.calculateProofOfReservesScore();
      const documentationResult = this.calculateDocumentationScore();
      const openSourceResult = this.calculateOpenSourceScore();
      
      // Compliance scores
      const licensingResult = this.calculateLicensingScore();
      const complianceProgramsResult = this.calculateComplianceProgramsScore();
      
      // Infrastructure scores
      const certificationsResult = this.calculateCertificationsScore();
      const auditsResult = this.calculateAuditsScore();
      const incidentResponseResult = this.calculateIncidentResponseScore();
      
      // User Security scores
      const authenticationResult = this.calculateAuthenticationScore();
      const transactionSecurityResult = this.calculateTransactionSecurityScore();
      
      // STEP 2: Update the data structure with calculated scores
      // Key Management
      this.data.keyManagement.items.coldStorage.score = coldStorageResult.score;
      this.data.keyManagement.items.multiSig.score = multiSigResult.score;
      this.data.keyManagement.items.hardware.score = hardwareResult.score;
      
      // Transparency
      this.data.transparency.items.proofOfReserves.score = proofOfReservesResult.score;
      this.data.transparency.items.documentation.score = documentationResult.score;
      this.data.transparency.items.openSource.score = openSourceResult.score;
      
      // Compliance
      this.data.compliance.items.licensing.score = licensingResult.score;
      this.data.compliance.items.compliancePrograms.score = complianceProgramsResult.score;
      
      // Infrastructure
      this.data.infrastructure.items.certifications.score = certificationsResult.score;
      this.data.infrastructure.items.audits.score = auditsResult.score;
      this.data.infrastructure.items.incidentResponse.score = incidentResponseResult.score;
      
      // User Security
      this.data.userSecurity.items.authentication.score = authenticationResult.score;
      this.data.userSecurity.items.transactionSecurity.score = transactionSecurityResult.score;
      
      // STEP 3: Calculate category scores
      // Key Management
      const keyManagementScore = coldStorageResult.score + multiSigResult.score + hardwareResult.score;
      this.logScore('keyManagement', 'categoryTotal', coldStorageResult.score, 'Added from coldStorage');
      this.logScore('keyManagement', 'categoryTotal', multiSigResult.score, 'Added from multiSig');
      this.logScore('keyManagement', 'categoryTotal', hardwareResult.score, 'Added from hardware');
      
      // Check if we need to cap the score
      if (keyManagementScore > this.data.keyManagement.maxScore) {
        this.logScore('keyManagement', 'categoryTotal', (keyManagementScore - this.data.keyManagement.maxScore) * -1, 'Category score capped at maximum');
      }
      this.data.keyManagement.score = Math.min(keyManagementScore, this.data.keyManagement.maxScore);
      
      // Transparency
      const transparencyScore = proofOfReservesResult.score + documentationResult.score + openSourceResult.score;
      this.logScore('transparency', 'categoryTotal', proofOfReservesResult.score, 'Added from proofOfReserves');
      this.logScore('transparency', 'categoryTotal', documentationResult.score, 'Added from documentation');
      this.logScore('transparency', 'categoryTotal', openSourceResult.score, 'Added from openSource');
      
      // Check if we need to cap the score
      if (transparencyScore > this.data.transparency.maxScore) {
        this.logScore('transparency', 'categoryTotal', (transparencyScore - this.data.transparency.maxScore) * -1, 'Category score capped at maximum');
      }
      this.data.transparency.score = Math.min(transparencyScore, this.data.transparency.maxScore);
      
      // Compliance
      const complianceScore = licensingResult.score + complianceProgramsResult.score;
      this.logScore('compliance', 'categoryTotal', licensingResult.score, 'Added from licensing');
      this.logScore('compliance', 'categoryTotal', complianceProgramsResult.score, 'Added from compliancePrograms');
      
      // Check if we need to cap the score
      if (complianceScore > this.data.compliance.maxScore) {
        this.logScore('compliance', 'categoryTotal', (complianceScore - this.data.compliance.maxScore) * -1, 'Category score capped at maximum');
      }
      this.data.compliance.score = Math.min(complianceScore, this.data.compliance.maxScore);
      
      // Infrastructure
      const infrastructureScore = certificationsResult.score + auditsResult.score + incidentResponseResult.score;
      this.logScore('infrastructure', 'categoryTotal', certificationsResult.score, 'Added from certifications');
      this.logScore('infrastructure', 'categoryTotal', auditsResult.score, 'Added from audits');
      this.logScore('infrastructure', 'categoryTotal', incidentResponseResult.score, 'Added from incidentResponse');
      
      // Check if we need to cap the score
      if (infrastructureScore > this.data.infrastructure.maxScore) {
        this.logScore('infrastructure', 'categoryTotal', (infrastructureScore - this.data.infrastructure.maxScore) * -1, 'Category score capped at maximum');
      }
      this.data.infrastructure.score = Math.min(infrastructureScore, this.data.infrastructure.maxScore);
      
      // User Security
      const userSecurityScore = authenticationResult.score + transactionSecurityResult.score;
      this.logScore('userSecurity', 'categoryTotal', authenticationResult.score, 'Added from authentication');
      this.logScore('userSecurity', 'categoryTotal', transactionSecurityResult.score, 'Added from transactionSecurity');
      
      // Check if we need to cap the score
      if (userSecurityScore > this.data.userSecurity.maxScore) {
        this.logScore('userSecurity', 'categoryTotal', (userSecurityScore - this.data.userSecurity.maxScore) * -1, 'Category score capped at maximum');
      }
      this.data.userSecurity.score = Math.min(userSecurityScore, this.data.userSecurity.maxScore);
      
      // STEP 4: Calculate total score
      const totalScore = this.data.keyManagement.score + 
                        this.data.transparency.score + 
                        this.data.compliance.score + 
                        this.data.infrastructure.score + 
                        this.data.userSecurity.score;
      
      // Log the category contributions to total score
      this.logScore('totalScore', 'overall', this.data.keyManagement.score, 'Added from keyManagement');
      this.logScore('totalScore', 'overall', this.data.transparency.score, 'Added from transparency');
      this.logScore('totalScore', 'overall', this.data.compliance.score, 'Added from compliance');
      this.logScore('totalScore', 'overall', this.data.infrastructure.score, 'Added from infrastructure');
      this.logScore('totalScore', 'overall', this.data.userSecurity.score, 'Added from userSecurity');
      
      // Store the calculated total score
      this._totalScore = totalScore;
      
      // Mark scores as calculated
      this.scoresCalculated = true;
      
      // Add debug information to the console
      console.log('===== SCORE BREAKDOWN =====');
      console.log('Key Management:', this.data.keyManagement.score, '/', this.data.keyManagement.maxScore);
      console.log('Transparency:', this.data.transparency.score, '/', this.data.transparency.maxScore);
      console.log('Compliance:', this.data.compliance.score, '/', this.data.compliance.maxScore);
      console.log('Infrastructure:', this.data.infrastructure.score, '/', this.data.infrastructure.maxScore);
      console.log('User Security:', this.data.userSecurity.score, '/', this.data.userSecurity.maxScore);
      console.log(`TOTAL SCORE: ${totalScore}/100`);
      console.log('==========================');
    }
    
    return this._totalScore;
  }

  updateUI() {
    // Force recalculation of scores if needed
    if (!this.scoresCalculated) {
      this.calculateTotalScore();
    }
    
    const totalScore = this._totalScore;
    
    // Update total score in all elements with the total-score class
    const totalScoreElements = document.querySelectorAll('.total-score');
    totalScoreElements.forEach(el => {
      el.textContent = totalScore;
    });
    
    // Add a debug panel to the page if in debug mode
    this.addDebugPanel();
    
    // Log the total score for debugging
    console.log('Updated total score display:', totalScore);

    // Update category scores
    Object.entries(this.data).forEach(([categoryId, category]) => {
      const categoryEl = document.querySelector(`[data-category="${categoryId}"]`);
      if (categoryEl) {
        const categoryScoreEl = categoryEl.querySelector('.category-score');
        if (categoryScoreEl) {
          categoryScoreEl.textContent = `${category.score}/${category.maxScore}`;
        }

        // Update item scores
        Object.entries(category.items).forEach(([itemId, item]) => {
          const itemEl = categoryEl.querySelector(`[data-item="${itemId}"]`);
          if (itemEl) {
            const itemScoreEl = itemEl.querySelector('.item-score');
            if (itemScoreEl) {
              itemScoreEl.textContent = `${item.score}/${item.maxScore}`;
            }
          }
        });
      }
    });

    // Update question indicators based on scores
    const updateQuestionStatus = (selector, score, maxScore) => {
      const el = document.querySelector(selector);
      if (el) {
        const status = el.querySelector('.status');
        if (status) {
          status.classList.remove('success', 'warning', 'error');
          if (score >= maxScore * 0.8) status.classList.add('success');
          else if (score >= maxScore * 0.4) status.classList.add('warning');
          else status.classList.add('error');
        }
      }
    };

    // Map questions to scores
    if (this.data.keyManagement?.items?.coldStorage) {
      updateQuestionStatus('.step:nth-child(1)', 
        this.data.keyManagement.items.coldStorage.score,
        this.data.keyManagement.items.coldStorage.maxScore);
    }

    if (this.data.transparency?.items?.documentation) {
      updateQuestionStatus('.step:nth-child(2)', 
        this.data.transparency.items.documentation.score,
        this.data.transparency.items.documentation.maxScore);
    }

    if (this.data.transparency?.items?.proofOfReserves) {
      updateQuestionStatus('.step:nth-child(3)', 
        this.data.transparency.items.proofOfReserves.score,
        this.data.transparency.items.proofOfReserves.maxScore);
    }

    if (this.data.compliance?.items?.licensing) {
      updateQuestionStatus('.step:nth-child(4)', 
        this.data.compliance.items.licensing.score,
        this.data.compliance.items.licensing.maxScore);
    }

    if (this.data.infrastructure?.items?.audits) {
      updateQuestionStatus('.step:nth-child(5)', 
        this.data.infrastructure.items.audits.score,
        this.data.infrastructure.items.audits.maxScore);
    }

    if (this.data.compliance?.items?.compliancePrograms) {
      updateQuestionStatus('.step:nth-child(6)', 
        this.data.compliance.items.compliancePrograms.score,
        this.data.compliance.items.compliancePrograms.maxScore);
    }

    if (this.data.transparency?.items?.openSource) {
      updateQuestionStatus('.step:nth-child(7)', 
        this.data.transparency.items.openSource.score,
        this.data.transparency.items.openSource.maxScore);
    }
  }
  
  // Add debug panel to the page
  // Score Debug Panel
  addDebugPanel() {
    // Check if debug mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'score';
    
    if (!debugMode) return;
    
    // Remove existing debug panel if it exists
    const existingPanel = document.getElementById('score-debug-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'score-debug-panel';
    debugPanel.style.cssText = 'position: fixed; bottom: 20px; right: 20px; width: 500px; max-height: 80vh; overflow-y: auto; background: rgba(0,0,0,0.8); color: #fff; padding: 15px; border-radius: 8px; font-family: monospace; z-index: 9999; font-size: 12px;';
    
    // Add header
    const header = document.createElement('h3');
    header.textContent = 'Score Debug Panel';
    header.style.cssText = 'margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 8px;';
    debugPanel.appendChild(header);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #f44336; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;';
    closeBtn.onclick = () => debugPanel.remove();
    debugPanel.appendChild(closeBtn);
    
    // Force recalculation of scores
    this.scoresCalculated = false;
    const totalScore = this.calculateTotalScore();
    
    // Add total score
    const totalScoreDiv = document.createElement('div');
    totalScoreDiv.style.cssText = 'margin-bottom: 15px; font-size: 16px; font-weight: bold;';
    totalScoreDiv.textContent = `Total Score: ${totalScore}/100`;
    debugPanel.appendChild(totalScoreDiv);
    
    // Add detailed breakdown section
    const detailedBreakdownDiv = document.createElement('div');
    detailedBreakdownDiv.style.cssText = 'margin-bottom: 15px;';
    
    // Add category scores with item breakdowns
    const categories = [
      { id: 'keyManagement', name: '1. Key Management & Security' },
      { id: 'infrastructure', name: '2. Infrastructure & Operations' },
      { id: 'transparency', name: '3. Transparency' },
      { id: 'compliance', name: '4. Regulatory Compliance' },
      { id: 'userSecurity', name: '5. User Security Features' }
    ];
    
    // Map internal item IDs to hierarchical section numbers
    const sectionMapping = {
      // Key Management & Security
      'coldStorage': '1.1 Hot/Cold Storage',
      'multiSig': '1.2 Multi-signature/MPC',
      'hardware': '1.3 Hardware Security',
      // Infrastructure & Operations
      'certifications': '2.1 Security Certifications',
      'audits': '2.2 Security Audits',
      'incidentResponse': '2.3 Incident Response',
      // Transparency
      'proofOfReserves': '3.1 Proof of Reserves',
      'documentation': '3.2 Documentation',
      'openSource': '3.3 Open Source Contributions',
      // Regulatory Compliance
      'licensing': '4.1 Licensing',
      'compliancePrograms': '4.2 Compliance Programs',
      // User Security Features
      'authentication': '5.1 Authentication',
      'transactionSecurity': '5.2 Transaction Security'
    };
    
    categories.forEach(category => {
      const cat = this.data[category.id];
      const catDiv = document.createElement('div');
      catDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 4px;';
      
      // Category header
      const catHeader = document.createElement('h4');
      catHeader.textContent = `${category.name}: ${cat.score}/${cat.maxScore}`;
      catHeader.style.cssText = 'margin: 0 0 10px 0; color: #4CAF50; border-bottom: 1px solid #555; padding-bottom: 5px;';
      catDiv.appendChild(catHeader);
      
      // Item scores
      Object.entries(cat.items).forEach(([itemId, item]) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'margin: 5px 0; padding-left: 10px;';
        const sectionTitle = sectionMapping[itemId] || itemId;
        itemDiv.innerHTML = `<strong>${sectionTitle}:</strong> ${item.score}/${item.maxScore}`;
        catDiv.appendChild(itemDiv);
      });
      
      // Add raw score before capping
      const rawScore = Object.values(cat.items).reduce((sum, item) => sum + item.score, 0);
      if (rawScore > cat.maxScore) {
        const rawScoreDiv = document.createElement('div');
        rawScoreDiv.style.cssText = 'margin-top: 10px; font-style: italic; color: #ff9800;';
        rawScoreDiv.textContent = `Raw score: ${rawScore} (capped at ${cat.maxScore})`;
        catDiv.appendChild(rawScoreDiv);
      }
      
      detailedBreakdownDiv.appendChild(catDiv);
    });
    
    debugPanel.appendChild(detailedBreakdownDiv);
    
    // Add log entries
    const logList = document.createElement('div');
    
    // Group logs by category
    const groupedLogs = {};
    this.debugLog.forEach(entry => {
      if (!groupedLogs[entry.category]) {
        groupedLogs[entry.category] = [];
      }
      groupedLogs[entry.category].push(entry);
    });
    
    // Create category sections
    Object.entries(groupedLogs).forEach(([category, entries]) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.style.cssText = 'margin-bottom: 15px; border-left: 3px solid #4CAF50; padding-left: 10px;';
      
      const categoryHeader = document.createElement('h4');
      categoryHeader.textContent = category;
      categoryHeader.style.cssText = 'margin: 5px 0; color: #4CAF50;';
      categoryDiv.appendChild(categoryHeader);
      
      // Add entries for this category
      entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = 'margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1);';
        entryDiv.innerHTML = `<strong>${entry.item}</strong>: <span style="color: ${entry.points > 0 ? '#4CAF50' : '#f44336'};">${entry.points > 0 ? '+' : ''}${entry.points}</span> (${entry.reason})`;
        categoryDiv.appendChild(entryDiv);
      });
      
      logList.appendChild(categoryDiv);
    });
    
    debugPanel.appendChild(logList);
    
    // Add to page
    document.body.appendChild(debugPanel);
  }
}

// custodianData will be provided by the HTML page that includes this script

// Toggle between list and grid view for apps
function toggleAppsView() {
  const appsContainer = document.querySelector('.see-also');
  const toggleButton = document.getElementById('viewToggle');
  const toggleIcon = toggleButton.querySelector('i');
  
  if (appsContainer.classList.contains('list-view')) {
    appsContainer.classList.remove('list-view');
    appsContainer.classList.add('grid-view');
    toggleIcon.classList.remove('fa-th-large');
    toggleIcon.classList.add('fa-list');
  } else {
    appsContainer.classList.remove('grid-view');
    appsContainer.classList.add('list-view');
    toggleIcon.classList.remove('fa-list');
    toggleIcon.classList.add('fa-th-large');
  }
}