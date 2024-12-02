---
layout: archive
title: "Binaries"
permalink: /binaries/
---

<div id="binariesTable"></div>

<script src="{{'/dist/nostr.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
      //getApplicationDetails("app.zeusln.zeus");
      const binary = getBinaryWithSha256("934b00ac68c3321f7e9fb20c91486a8ef7c10a53fc825023126bd34d08bffa5f");
      const binaries = await getBinaries();
      renderBinariesTable(binaries);
  })();
</script>