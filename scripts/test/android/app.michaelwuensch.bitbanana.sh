#!/bin/bash
# app.michaelwuensch.bitbanana.sh
# App-specific script for building the BitBanana app
# Expects variables from testAAB.sh: appId, versionName, workDir
# modify deviceSpec variable if using a different phone

# Ensure the script is sourced from testAAB.sh
if [ -z "$workDir" ] || [ -z "$versionName" ] || [ -z "$appId" ]; then
    echo "Error: Required variables not set. Please run this script via testAAB.sh."
    exit 1
fi

repo="https://github.com/michaelWuensch/BitBanana.git"
tag="v$versionName"
deviceSpec="/var/shared/device-spec/a11/device-spec.json"  # Default value, can be overridden

# Verify device spec exists
if [ ! -f "$deviceSpec" ]; then
    echo "Error: Device spec not found at $deviceSpec"
    exit 1
fi

test() {
    echo "Building BitBanana version $versionName..."
    
    # Clone and build AAB using container
    podman run --rm -v "$workDir":/project mingc/android-build-box:1.28.0 bash -c \
        "cd /project && \
        git clone $repo && \
        cd BitBanana && \
        git checkout $tag && \
        ./gradlew bundleRelease" || {
            echo "Error: Failed to build AAB"
            return 1
        }

    # Find the AAB file
    cd "$workDir/BitBanana/app/build/outputs/bundle/release" || {
        echo "Error: Bundle output directory not found"
        return 1
    }
    
    # Find the actual AAB file (it might have a different name pattern)
    aab_file=$(find . -name "*.aab" -type f)
    if [ -z "$aab_file" ]; then
        echo "Error: No AAB file found"
        return 1
    fi
    aab_file=$(basename "$aab_file")
    echo "Found AAB file: $aab_file"

    # Create output directory with proper permissions
    mkdir -p "$workDir/built-split_apks"
    sudo chmod -R 777 "$workDir/built-split_apks"

    # Copy AAB to built-split_apks directory
    cp "$aab_file" "$workDir/built-split_apks/" || {
        echo "Error: Failed to copy AAB file"
        return 1
    }

    # Generate APKs from AAB using device spec inside container
    echo "Generating split APKs using bundletool..."
    podman run --rm \
        -v "$workDir/built-split_apks":/workspace \
        -v "$deviceSpec":/workspace/device-spec.json \
        mingc/android-build-box:1.28.0 bash -c \
        "cd /workspace && \
        echo 'Downloading bundletool...' && \
        curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar && \
        chmod +x bundletool.jar && \
        echo 'Running bundletool...' && \
        java -jar bundletool.jar build-apks \
            --bundle=$aab_file \
            --output=bitbanana-split.apks \
            --device-spec=device-spec.json" || {
            echo "Error: Failed to generate split APKs"
            return 1
        }

    # Extract APKs
    cd "$workDir/built-split_apks" || {
        echo "Error: Failed to change to built-split_apks directory"
        return 1
    }
    
    unzip -o bitbanana-split.apks || {
        echo "Error: Failed to extract split APKs"
        return 1
    }
    
    cp -r splits/*.apk . || {
        echo "Error: Failed to copy APKs from splits directory"
        return 1
    }

    # Rename base-master.apk to base.apk
    if [ -f "base-master.apk" ]; then
        mv "base-master.apk" "base.apk"
    fi
    
    rm -rf splits toc.pb bitbanana-split.apks bundletool.jar
    echo "Successfully generated split APKs"
}

# Call test function when script is sourced
test