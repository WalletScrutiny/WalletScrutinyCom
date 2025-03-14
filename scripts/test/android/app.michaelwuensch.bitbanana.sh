# Create workDir if it doesn't exist
mkdir -p "$workDir/bitbanana"

# Clone the BitBanana repository into workDir
git clone https://github.com/michaelWuensch/BitBanana "$workDir/bitbanana"
cd "$workDir/bitbanana"

versionTag="$versionName"

git checkout "v$versionTag"

# Move to reproducible-builds directory
cd reproducible-builds

# Build Docker image
docker build --platform linux/amd64 -t bitbanana-build-env .

# Move back to root directory
cd "$workDir/bitbanana"

# Build the app by running the container
docker run --rm --privileged -v "$(pwd)":/app-src --device /dev/fuse --cap-add SYS_ADMIN bitbanana-build-env bash -c "mkdir /app; disorderfs --sort-dirents=yes --reverse-dirents=no /app-src/ /app/; cd /app && gradle clean bundleRelease"

# Download the latest bundletool
curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.18.0/bundletool-all-1.18.0.jar
ls -lh bundletool*.jar

# Create directory where the apks will be placed
mkdir -p ./reproducible-builds/apks/built-apks

# Verify device-spec.json exists
if [ ! -f ./device-spec.json ]; then
  echo "Error: Failed to create or copy device-spec.json"
  exit 1
fi

echo "device-spec.json contents:"
cat ./device-spec.json

# Run bundletool
java -jar bundletool.jar build-apks \
  --bundle=./app/build/outputs/bundle/release/bitbanana-${versionName}_${versionCode}-release.aab \
  --output-format=DIRECTORY \
  --output=./reproducible-builds/apks/built-apks \
  --device-spec="device-spec.json"

# Copy to expected folder
echo "Copying produced artifacts for testAAB.sh comparison"
mkdir -p "$workDir/built-split_apks"
cp -r ./reproducible-builds/apks/built-apks/splits/*.apk "$workDir/built-split_apks"

# Bitbanana internal comparison to copy from source APK directory
mkdir -p ./reproducible-builds/apks/playstore-apks/
echo "Copying Play Store APKs from $apkDir to ./reproducible-builds/apks/playstore-apks/"
cp -r "$apkDir"/*.apk ./reproducible-builds/apks/playstore-apks/

# Move into reproducible-builds folder
cd ./reproducible-builds

# Execute python script to format output
# What the script does:
#
# - Copies reproducible-builds/apks/ to reproducible-builds/extracted_apks/
# In this new directory the following changes are applied:
#
# - Moves all .apk files from built-apks/splits to built-apks
# - Deletes now empty built-apks/splits folder
# - Deletes built-apks/toc.pb
# - Renames built-apks/base-master.apk to base.apk
# - Renames the other two apks in built-apks/ by replacing "base" with "split_config".
# - Extracts all apks in built-apks/ and playstore-apks/ and deletes the original apk files after extracting them
echo "========================================"
echo "Executing python script to format output"
echo "========================================"
python3 MakeComparable.py --decompile

# Runs bitbanana's internal comparison script
echo "=============================================="
echo "Running Bitbanana's Internal Comparison Script"
echo "=============================================="
python3 Diff.py 
