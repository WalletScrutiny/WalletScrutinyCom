---
layout: archive
title: "Creating New Attestation"
permalink: /new_attestation_2/
---

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const content = "I've been unable to reproduce it after trying for 4 hours";

    const createdAttestationResult = await createAttestation({
      sha256: "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe",
      content: content,
      status: "non-reproducible",
      assetEventId: "345124e857bc59cbf47353d25d0dad8745f6c15921844f23f486b95c28908797"
    });
  })();
</script>