#!/bin/sh

# run this using Docker:
# docker run -it -v$PWD:/mnt node bash /mnt/getInfoForAppId.sh com.company1.wallet com.company2.wallet

for appId in "$@"; do
  echo updating info for app $appId

  npm install google-play-scraper dateformat sync-request
  cd /mnt

  node getInfoForAppId.js $appId
done
