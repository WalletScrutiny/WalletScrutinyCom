import appStore from './scripts/helperAppStore.mjs';
import playStore from './scripts/helperPlayStore.mjs';
import helper from './scripts/helper.mjs';
import fs from 'fs';
import dateFormat from 'dateformat';
import readline from 'readline';
import yaml from 'js-yaml';
const defunctsFile = '_data/defunct.yaml';
process.env.TZ = 'UTC'; // fix timezone issues

async function refresh (markDefunct, apps) {
  const today = dateFormat(new Date(), 'yyyy-mm-dd');
  const fileContents = fs.readFileSync(defunctsFile, 'utf8');
  const data = yaml.load(fileContents, { schema: yaml.FAILSAFE_SCHEMA });
  for (const key in data) {
    if (data[key] === null) {
      delete data[key];
    }
  }
  var yamlStr = yaml.dump(data, {
    schema: yaml.FAILSAFE_SCHEMA,
    noArrayIndent: true
  });
  if (!data[today]) {
    yamlStr += `\n${today}:\n`;
  }
  fs.writeFileSync(defunctsFile, yamlStr, 'utf8');
  if (apps) {
    const ids = apps.split(',');
    const appStoreIds = ids.filter(it => it.startsWith('iphone')).map(it => it.split('/')[1]);
    const playStoreIds = ids.filter(it => it.startsWith('android')).map(it => it.split('/')[1]);
    appStore.refreshAll(appStoreIds, markDefunct);
    playStore.refreshAll(playStoreIds, markDefunct);
  } else {
    appStore.refreshAll();
    playStore.refreshAll();
  }
  const updateMillis = 500;
  var msg = '';
  var msgAgeMs = 0;
  const i = setInterval(() => {
    const newMsg = `remaining: ${playStore.stats.remaining + appStore.stats.remaining}, 🤖: defunct ${playStore.stats.removed}, updated ${playStore.stats.updated}, 🍎: defunct ${appStore.stats.removed}, updated ${appStore.stats.updated}`;
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(newMsg);
    readline.cursorTo(process.stdout, 0); // other console.out stuff should write over this.
    if (msg === newMsg) {
      msgAgeMs += updateMillis;
    } else {
      msg = newMsg;
      msgAgeMs = 0;
    }
    if (playStore.stats.remaining + appStore.stats.remaining === 0 || msgAgeMs > 30000) {
      console.log(`
        Finished.`);
      clearInterval(i);
    }
  }, updateMillis);
}

export default {
  refresh
};
