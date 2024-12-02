import NDK from "@nostr-dev-kit/ndk";

const appKind = 32267;
const releaseKind = 30063;
const fileMetadataKind = 1063;

const ndk = new NDK({
  explicitRelayUrls: [
    "wss://relay.zapstore.dev"
  ],
});

function getFirstTag(event, tagName) {
  const tags = event.getMatchingTags(tagName);
  return tags.length === 0 ? "" : tags[0][1];
}

const getBinaryWithSha256 = async function (binarySha256) {
  console.debug("Getting binaries for: ", binarySha256);

  await ndk.connect();

  const binaries = await ndk.fetchEvents({
    kinds: [fileMetadataKind],
    "#x": [binarySha256]
  });

  for (const binary of binaries) {
    console.log(binary.rawEvent());
  }
}

const getBinaries = async function () {
  console.debug("Getting last 20- binaries");

  await ndk.connect();

  const binaries = await ndk.fetchEvents({
    kinds: [fileMetadataKind],
    limit: 10
  });

  for (const binary of binaries) {
    console.log(binary.rawEvent());
  }

  console.log('binaries:', binaries);

  return binaries;
}

const renderBinariesTable = async function (binaries) {
  const table = document.createElement('table');
  table.border = 1;
  const header = table.createTHead();
  const headerRow = header.insertRow(0);

  const headers = ["Content", "Created At", "Pubkey"];
  headers.forEach((text, index) => {
    const cell = headerRow.insertCell(index);
    cell.innerText = text;
  });

  const body = table.createTBody();

  binaries.forEach((binary, rowIndex) => {
    const row = body.insertRow(rowIndex);
    const cells = [
      binary.content,
      new Date(binary.created_at * 1000).toLocaleString(), // Convertir timestamp a fecha legible
      binary.pubkey
    ];

    cells.forEach((cellContent, cellIndex) => {
      const cell = row.insertCell(cellIndex);
      cell.innerText = cellContent;
    });
  });

  document.getElementById('binariesTable').appendChild(table);
}

const getApplicationDetails = async function (appPackageName) {
  await ndk.connect();

  console.log(`--- Searching apps with packageName: ${appPackageName}`);
  const appEvents = await ndk.fetchEvents({
    kinds: [appKind],
    "#d": appPackageName
  });

  for (const appEvent of appEvents) {
    const name = getFirstTag(appEvent, 'name');
    const description = getFirstTag(appEvent, 'description');
    const url = getFirstTag(appEvent, 'url');
    const repository = getFirstTag(appEvent, 'repository');
    console.log(`     *** Application: ${name}`);
    console.log(`     *** Description: ${description}`);
    console.log(`     *** URL: ${url}`);
    console.log(`     *** Repository: ${repository}`);

    const releasesSearchKey = `${appKind}:${appEvent.pubkey}:${appPackageName}`;
    console.log(`\n--- Searching releases for key: ${releasesSearchKey}`);
    const releaseEvents = await ndk.fetchEvents({
      kinds: [releaseKind],
      "#a": [releasesSearchKey]
    });

    for (const releaseEvent of releaseEvents) {
      //console.log(`     *** Release event: ${releaseEvent.content}`);

      const identifierVersion = getFirstTag(releaseEvent, 'd');
      console.log(`     *** Version: ${identifierVersion.split('@')[1]}`);

      for (const tag of releaseEvent.getMatchingTags("e")) {
        const eTagBinaryId = tag[1];
        console.log(`     *** Binary found. ID: ${eTagBinaryId}`);

        console.log(`\n--- Searching binary metadata id: ${eTagBinaryId}`);

        const binaryMetadataEvent = await ndk.fetchEvent({
          kinds: [fileMetadataKind],
          ids: [eTagBinaryId]
        });

        const sha256 = getFirstTag(binaryMetadataEvent, 'x');
        const size = getFirstTag(binaryMetadataEvent, 'size');
        const image = getFirstTag(binaryMetadataEvent, 'image');

        console.log(`     *** Binary data found: ${binaryMetadataEvent.content}`);
        console.log(`     *** SHA256: ${sha256}`);
        console.log(`     *** Size: ${size}`);
        //console.log(`     *** Image: ${image}`);

        for (const tag of binaryMetadataEvent.getMatchingTags("url")) {
          console.log(`     *** URL: ${tag[1]}`);
        }

        for (const tag of binaryMetadataEvent.getMatchingTags("arch")) {
          console.log(`     *** ARCH: ${tag.toString()}`);
        }
      }
    }
  }
}

window.getBinaryWithSha256 = getBinaryWithSha256;
window.getApplicationDetails = getApplicationDetails;
window.getBinaries = getBinaries;
window.renderBinariesTable = renderBinariesTable;

export {
  getApplicationDetails,
  getBinaries,
  getBinaryWithSha256,
  renderBinariesTable
};

//console.log(releaseEvent.rawEvent());

//const packageAppToSearch = process.argv[2];  // "app.zeusln.zeus"