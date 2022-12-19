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

(async () => {
  const experts = (await import('../assets/js/experts.mjs')).default
  const names = await getNames();
  const summariser = new Summariser({
    relay: 'wss://relay.nostr.info',
    trustedAuthors: experts
  });
  await summariser.onReady();

  const all = {};
  console.log(names);

  for (const n of names) {
    const opinion = await summariser.get(n);
    all[n] = opinion;
  }
  await fs.writeFile('_includes/allOpinions.html', JSON.stringify(all))
  process.exit(0);
})();
