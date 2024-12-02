---
layout: archive
title: "Latest Binaries"
permalink: /binaries/
---

<div id="binariesTable"></div>

<script src="{{'/dist/attestation.bundle.min.js' | relative_url }}"></script>

<script>
  (async () => {
    const response = await getBinaries(5);

    const binaries = Array.from(response);

    const sortedBinaries = binaries.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th style="text-align: center;">Name</th><th style="text-align: center;">SHA256</th><th style="text-align: center;">Created At</th>';
    table.appendChild(headerRow);

    sortedBinaries.forEach(binary => {
      const row = document.createElement('tr');
      const date = new Date(binary.created_at * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const sha256Hash = binary.tags.find(tag => tag[0] === 'x')?.[1] || '';
      const truncatedHash = `${sha256Hash.slice(0,4)}...${sha256Hash.slice(-4)}`;
      
      row.innerHTML = `
        <td>${binary.content}</td>
        <td>
          <span>${truncatedHash}</span>
          <button onclick="navigator.clipboard.writeText('${sha256Hash}')" style="border: none; background: none; cursor: pointer; padding: 0 5px;">
            📋
          </button>
        </td>
        <td>${date}</td>
      `;
      table.appendChild(row);
    });

    document.getElementById('binariesTable').appendChild(table);
  })();
</script>