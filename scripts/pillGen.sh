#!/bin/bash

# Get absolute path to the assets directory
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS_DIR="$SITE_ROOT/assets/images/pills"

# Check if template images exist
if [ ! -f "$ASSETS_DIR/good.png" ] || [ ! -f "$ASSETS_DIR/bad.png" ]; then
    echo "Error: Template images (good.png, bad.png) not found in $ASSETS_DIR"
    echo "Please ensure these images exist before running this script."
    exit 1
fi

# Process files function
process_file() {
    local yaml_file="$1"
    local platform="$2"
    
    # First check if meta is ok
    meta=$(grep -m 1 "meta:" "$yaml_file" | cut -d':' -f2 | tr -d ' \r\n')
    if [ "$meta" != "ok" ]; then
        # echo -n "s" 
        return
    fi
    
    verdict=$(grep -m 1 "verdict:" "$yaml_file" | cut -d':' -f2 | tr -d ' \r\n')
    base_name=$(basename "$yaml_file")
    base_name="${base_name%.*}"
    platform_dir="$ASSETS_DIR/$platform"
    mkdir -p "$platform_dir"
    output_file="$platform_dir/$base_name.png"
    
    case "$verdict" in
        "sourceavailable")
            echo -n "+"
            (cd "$platform_dir" && ln -sf "../good.png" "$base_name.png")
            ;;
       "obfuscated")
            echo -n "-"
            (cd "$platform_dir" && ln -sf "../bad.png" "$base_name.png")
            ;;
    esac
}

export -f process_file
export ASSETS_DIR

# Process each platform
for platform in android hardware; do
    echo -e "\nProcessing platform: $platform"
    rm -rf "$ASSETS_DIR/$platform"
    mkdir -p "$ASSETS_DIR/$platform/"
    find "_$platform" -name "*.md" -type f -print0 | \
        parallel -0 process_file {} "$platform"
done

echo -e "\nDone!"
