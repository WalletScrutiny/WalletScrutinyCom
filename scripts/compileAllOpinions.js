const Summariser = require('./nostr-opinion-summariser').default;
const fs = require('fs/promises');

const getNames = async () => {
  const folders = ['iphone', 'android', 'hardware', 'bearer'];
  const names = (
    await Promise.all(
      folders.map(async (category) =>
        (
          await fs.readdir(`_${category}/`)
        ).map((n) => {
          n = n.replace('.md', '');
          return `/${category}/${n}/`;
        })
      )
    )
  ).flat();

  return names;
};

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

(async () => {
  const experts = (await import('../assets/js/experts.mjs')).default
  const names = await getNames();
  const summariser = new Summariser({
    relay: 
    // [
      // 'wss://relay.nostr.info',
      // 'wss://relayable.org',
      // 'wss://nostr.wine',
      'wss://nos.lol',
      // 'wss://nostr.mom',
      // 'wss://nostr.oxtr.dev',
    // ],
    trustedAuthors: experts
  });
  await summariser.onReady();

  const all = {};
  console.log(names);

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
  await fs.writeFile('_includes/allOpinions.html', JSON.stringify(all))
  process.exit(0);
})();
