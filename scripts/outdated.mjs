import helper from './helper.mjs';
import helperPlayStore from './helperPlayStore';
import helperAppStore from './helperAppStore';
import helperHardware from './helperHardware';
import helperBearer from './helperBearer';

const migration = function (header, body, fileName, categoryHelper) {
  const category = categoryHelper.category;
  // make sure, appId matches file name
  header.appId = fileName.slice(0, -3);
  if (header.verdict !== 'wip' || header.meta === 'defunct') {
    return;
  }
  var score = header.users || header.reviews || 1;
  switch (header.meta) {
    case 'ok':
      score *= 100;
      break;
    case 'stale':
      score *= 10;
      break;
    case 'obsolete':
      score *= 1;
      break;
  }
  score = (`00000000000${score}`).slice(-11);
  console.log(`${category} ${score} _${category}/${fileName}`);
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer].forEach(h => {
  helper.migrateAll(h, migration);
});
