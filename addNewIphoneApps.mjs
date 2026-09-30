import helper from './scripts/helperAppStore.mjs';

const args = process.argv.slice(2);
const mergeIntoIdx = args.indexOf('--merge-into');
let mergeInto;
if (mergeIntoIdx !== -1) {
  mergeInto = args[mergeIntoIdx + 1];
  args.splice(mergeIntoIdx, 2);
}
const newIdds = args;

helper.add(newIdds, { mergeInto });
