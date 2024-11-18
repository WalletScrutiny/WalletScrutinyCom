#!/bin/bash
# io.nunchuk.android.sh v0.1.0-alpha.3
# App-specific script for building the Nunchuk app
# Expects variables from testAAB.sh: appId, versionName, workDir

# Build the Docker image for the Nunchuk app
echo "Building Docker image for Nunchuk app..."
podman build -t nunchuk-android -f "$TEST_ANDROID_DIR/io.nunchuk.android.dockerfile" .

# Create a temporary container name to facilitate file copying
container_name="nunchuk_android_builder_$(date +%s)"

# Run the container, execute all necessary commands, and keep it for copying files
echo "Running the Docker container and executing build commands..."
podman run --name $container_name -it --rm=false nunchuk-android /bin/bash -c "
    # Clone the Nunchuk repository
    git clone https://github.com/nunchuk-io/nunchuk-android && cd nunchuk-android
    git checkout 'android.$versionName' || exit 1

    # Modify gradle.properties for memory settings
    echo 'Modifying gradle.properties for memory settings...'
    sed -i 's/-Xmx8192m/-Xmx4096m/' gradle.properties
    sed -i 's/-XX:MetaspaceSize=8192m/-XX:MetaspaceSize=4096m/' gradle.properties

    # Build the AAB file
    echo 'Building the production release bundle...'
    ./gradlew bundleProductionRelease

    # Generate device-spec.json file
    # Modify this to suit your device's actual values
echo 'Generating device-spec.json...'
cat <<EOL > device-spec.json
    {
      "supportedAbis": ["armeabi-v7a", "armeabi"],
      "supportedLocales": ["en"],
      "screenDensity": 280,
      "sdkVersion": 31
    }
EOL

    # Download and prepare bundletool
    echo 'Downloading bundletool...'
    curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar
    chmod +x bundletool.jar

    # Generate split APKs using bundletool
    echo 'Generating split APKs...'
    java -jar bundletool.jar build-apks \
      --bundle=./nunchuk-app/build/outputs/bundle/productionRelease/nunchuk-app-production-release.aab \
      --output=nunchuk-split.apks \
      --device-spec=device-spec.json \
      --overwrite

    # Extract the generated split APKs
    echo 'Extracting split APKs...'
    mkdir -p split_apks && unzip -d split_apks nunchuk-split.apks

    # Confirm outputs
    echo 'Contents of split APKs directory:'
    ls -al split_apks/splits/
    pwd

    # Display the absolute path
    echo 'Absolute path to split APKS:'
    realpath split_apks/splits/
"

# Verify container status
echo "Checking if container $container_name exists..."
podman ps -a --filter "name=$container_name"

# Copy the split APKs to the host machine
echo "Copying split APKs to the host machine..."
mkdir -p "$workDir/built-split_apks"
podman cp "$container_name":/home/appuser/app/nunchuk/nunchuk-android/split_apks/splits/. "$workDir/built-split_apks/"

# After copying files, add:
echo "Verifying copy and renaming files..."
ls -la "$workDir/built-split_apks"  # Debug: check if directory exists and contents
cd "$workDir/built-split_apks"
mv base-master.apk base.apk
for f in base-*.apk; do
    [ -f "$f" ] || continue  # Skip if no matches found
    [ "$f" = "base.apk" ] && continue
    config_name=$(echo "$f" | sed 's/base-/split_config./')
    mv "$f" "$config_name"
done
ls -la  # Debug: verify final contents

# Clean up the container
echo "Cleaning up the container..."
podman rm $container_name

echo "App-specific build process completed."