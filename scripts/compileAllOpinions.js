const Summariser = require('./nostr-opinion-summariser').default;
const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Mobile pages use subject keys `mobile/{slug}`. Historical Nostr opinions still
 * use `android/{appId}` / `iphone/{appId}`. Aggregate all known aliases under the
 * canonical `mobile/{slug}` key that fewWallets.js / allWallets.js look up.
 */
async function mobileWalletTargets () {
  const targets = [];
  const dir = '_mobile';
  for (const file of await fs.readdir(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    let doc;
    try {
      doc = yaml.load(m[1]);
    } catch {
      continue;
    }
    const keys = new Set([`mobile/${slug}`]);
    if (doc?.android?.appId) {
      keys.add(`android/${doc.android.appId}`);
    }
    if (doc?.iphone?.appId) {
      keys.add(`iphone/${doc.iphone.appId}`);
    }
    targets.push({ outKey: `mobile/${slug}`, keys: [...keys] });
  }
  return targets;
}

async function categoryTargets (category) {
  const dir = `_${category}`;
  return (await fs.readdir(dir))
    .filter((n) => n.endsWith('.md'))
    .map((n) => {
      const id = n.replace(/\.md$/, '');
      const key = `${category}/${id}`;
      return { outKey: key, keys: [key] };
    });
}

const getTargets = async () => {
  const mobile = await mobileWalletTargets();
  const other = await Promise.all(
    ['hardware', 'bearer', 'desktop'].map(categoryTargets)
  );
  return [...mobile, ...other.flat()];
};

function mergeOpinionCounts (opinions) {
  const merged = { positive: 0, neutral: 0, negative: 0 };
  for (const opinion of opinions) {
    for (const k of Object.keys(merged)) {
      merged[k] += opinion[k] || 0;
    }
  }
  for (const k of Object.keys(merged)) {
    if (merged[k] === 0) {
      delete merged[k];
    }
  }
  return merged;
}

function isEmpty (obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

(async () => {
  const targets = await getTargets();
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

  for (const { outKey, keys } of targets) {
    const opinion = mergeOpinionCounts(keys.map((k) => summariser.get(k)));
    if (!isEmpty(opinion)) {
      all[outKey] = opinion;
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
