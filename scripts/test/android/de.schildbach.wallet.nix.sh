#! /usr/bin/env nix-shell
#! nix-shell -i bash --pure ../../../default.nix

repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  # Create sorted directory
  mkdir -p /sorted/
  disorderfs --sort-dirents=yes --reverse-dirents=no $workDir/app /sorted/
  
  # Build the app
  cd /sorted/
  ANDROID_HOME=$ANDROID_HOME gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
  
  # Execute user action if required
  if [ -n "$takeUserActionCommand" ]; then
    eval "$takeUserActionCommand"
  fi
}
