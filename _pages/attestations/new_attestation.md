---
layout: archive
title: "Creating New Attestation"
permalink: /new_attestation/
---

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const content = "## Zeus Wallet Build Verification\nSuccessfully compiled Zeus Wallet v1.2.3 from source.\nBuild environment: Ubuntu 22.04, Node.js 18.15.0\nAll tests passed ✅\nBinary matches expected hash.\n\n*Verified on: 2024-12-04*";

    const createdAttestationResult = await createAttestation({
      sha256: "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe",
      content: content,
      status: "reproducible",
      assetEventId: "345124e857bc59cbf47353d25d0dad8745f6c15921844f23f486b95c28908797"
    });
  })();
</script>