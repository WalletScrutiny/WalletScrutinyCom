// List all social links.
// $ node scripts/socialLinks.js | awk -F "/" '{print $3}' | sed 's/^www.//g' | sort -u
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


const helper = require('./helper.js')
const helperPlayStore = require('./helperPlayStore')
const helperAppStore = require('./helperAppStore')
const helperHardware = require('./helperHardware')
const helperBearer = require('./helperBearer')

const sl = function (header, body, fileName, category) {
  (header.social || []).forEach(it => console.log(it))
}; // crucial semicolon!

[helperPlayStore, helperAppStore, helperHardware, helperBearer].forEach(h => {
  helper.migrateAll(h.category, sl, h.headers)
})
