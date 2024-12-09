---
layout: archive
title: "Creating New Endorsement"
permalink: /new_endorsement/
---

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const createdAttestationResult = await createEndorsement({
      sha256: "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe",
      content: "I got the same result as the attestation",
      status: "reproducible",
      attestationEventId: "fadfdbf05f0920a5f793fa1af32fa8855e76066de7cab898fe969648c61fb025"
    });
  })();
</script>