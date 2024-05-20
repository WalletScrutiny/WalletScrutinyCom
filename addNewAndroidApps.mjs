import helper from './scripts/helperPlayStore.mjs';

const newAppIds = process.argv.slice(2);

helper.add(newAppIds);
