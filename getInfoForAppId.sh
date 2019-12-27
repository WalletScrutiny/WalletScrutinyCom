#!/bin/sh

# run this using Docker:
# docker run -it -v$PWD:/mnt node bash /mnt/getInfoForAppId.sh com.company1.wallet com.company2.wallet

echo "Cleaning up"
npm install google-play-scraper dateformat sync-request js-yaml sleep
cd /mnt

node getInfoSanitize.js

for appId in "$@"; do
  echo updating info for app $appId

  node getInfoForAppId.js $appId
done
