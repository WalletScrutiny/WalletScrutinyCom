#!/bin/sh

# run this using Docker: `docker run -it -v$PWD:/mnt node bash /mnt/getInfoForAppId.sh com.mycelium.wallet`

appId=$1
echo updating info for app $appId

npm install google-play-scraper dateformat sync-request
cd /mnt

node getInfoForAppId.js $appId
