// List all social links.
// $ node scripts/socialLinks.mjs | awk -F "/" '{print $3}' | sed 's/^www.//g' | sort -u
// aparat.com
// api.whatsapp.com
// behance.net
// beyondprotocol.medium.com
// biconomycom.medium.com
// bitcointalk.org
// bitrated.com
// blog.coincorner.com
// blog.ennowallet.com
// blog.naver.com
// coinstore.medium.com
// discord.com
// discord.gg
// discord.me
// everusworld.medium.com
// facebook.com
// fiahub.com
// github.com
// google.com
// hodllabs.medium.com
// icointechnology.com
// instagram.com
// join.slack.com
// keybase.io
// kmint-protocol.medium.com
// linkedin.com
// medium.com
// nunchuk.medium.com
// peakd.com
// pinterest.com
// pinterest.ph
// reddit.com
// social.nitrokey.com
// tiktok.com
// t.me
// touchain.medium.com
// twitter.com
// vimeo.com
// vk.com
// walahala.slack.com
// weibo.com
// youtube.com

import helper from './helper.mjs';
import helperPlayStore from './helperPlayStore';
import helperAppStore from './helperAppStore';
import helperHardware from './helperHardware';
import helperBearer from './helperBearer';

const knownDomains = new Set([
  "bitcointalk","discord","facebook","github","google","instagram","keybase",
  "linkedin","medium","pinterest","reddit","slack","t","tiktok","twitter",
  "vimeo","vk","weibo","whatsapp","youtube","archive"]);

const migration = function (header, body, fileName, categoryHelper) {
  const category = categoryHelper.category;
  (header.social || []).forEach( url => {
    try {
      if (url.startsWith("mailto")) {
        return;
      }
      const domain = url.split('/')[2].split('.').reverse()[1];
      if (!knownDomains.has(domain)) {
        console.log(domain, ': ', url);
      }
    } catch (e) {
      console.error(fileName, url);
    }
  });
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer].forEach(h => {
  helper.migrateAll(h, migration);
});
