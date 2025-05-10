const Summariser = require('./nostr-opinion-summariser').default;
const fs = require('fs/promises');

const getNames = async () => {
  const folders = ['iphone', 'android', 'hardware', 'bearer', 'desktop'];
  const names = (
    await Promise.all(
      folders.map(async (category) =>
        (
          await fs.readdir(`_${category}/`)
        ).map((n) => {
          n = n.replace('.md', '');
          return `${category}/${n}`;
        })
      )
    )
  ).flat();

  return names;
};

function isEmpty (obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

(async () => {
  const names = await getNames();
  // todo: shouldn't have to configure the trusted authors twice in this project
  const summariser = new Summariser({
    relay: 'wss://nos.lol',
    trustedAuthors: [
      'npub1gm7tuvr9atc6u7q3gevjfeyfyvmrlul4y67k7u7hcxztz67ceexs078rf6', // Leo
      'npub1r709glp0xx2zvgac45wswufjst5xgr7cear5a8me7x9vazhjzmksp2sf7d', // Danny
      'npub1mtd7s63xd85ykv09p7y8wvg754jpsfpplxknh5xr0pu938zf86fqygqxas' // The Bitcoin Hole
    ]
  });
  await summariser.onReady();

  const all = {};

  for (const n of names) {
    const opinion = await summariser.get(n);
    for (const k in opinion) {
      if (opinion[k] === 0) {
        delete opinion[k];
      }
    }
    if (!isEmpty(opinion)) {
      all[n] = opinion;
    }
  }

  // Format the JSON with one line per top-level key for better diffs
  const formatJson = (obj) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    
    const formattedEntries = entries.map(([key, value]) => 
      `  "${key}":${JSON.stringify(value)}`
    );
    
    return `{\n${formattedEntries.join(',\n')}\n}`;
  };

  await fs.writeFile('_includes/allOpinions.json', formatJson(all));
  process.exit(0);
})();
