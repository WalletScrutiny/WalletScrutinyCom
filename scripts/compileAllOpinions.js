const Summariser = require('./nostr-opinion-summariser').default;
const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

async function mobileWalletNames () {
  const names = [];
  const dir = '_mobile';
  for (const file of await fs.readdir(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    let doc;
    try {
      doc = yaml.load(m[1]);
    } catch {
      continue;
    }
    if (doc?.android?.appId) {
      names.push(`android/${doc.android.appId}`);
    }
    if (doc?.iphone?.appId) {
      names.push(`iphone/${doc.iphone.appId}`);
    }
  }
  return names;
}

async function categoryNames (category) {
  const dir = `_${category}`;
  return (await fs.readdir(dir))
    .filter((n) => n.endsWith('.md'))
    .map((n) => `${category}/${n.replace(/\.md$/, '')}`);
}

const getNames = async () => {
  const mobile = await mobileWalletNames();
  const other = await Promise.all(
    ['hardware', 'bearer', 'desktop'].map(categoryNames)
  );
  return [...mobile, ...other.flat()];
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
