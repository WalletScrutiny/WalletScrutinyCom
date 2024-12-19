#!/bin/bash

# Get absolute path to the assets directory
SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS_DIR="$SITE_ROOT/assets/images/pills"
mkdir -p "$ASSETS_DIR"

# Generate template images if they don't exist
if [ ! -f "$ASSETS_DIR/good.png" ]; then
    echo "Generating template images..."
    # Create mask
    convert -size 120x20 xc:black \
            -fill white -draw "roundrectangle 0,0 119,19 4,4" \
            "$ASSETS_DIR/mask.png"

    # Create good pill
    convert -size 90x20 xc:black -size 30x20 xc:darkgreen +append \
            -font "$SITE_ROOT/assets/fonts/Barlow/barlow-v12-latin-500.ttf" \
            -fill white -pointsize 12 \
            -draw "text 5,14 'reproducible:'" -draw "text 95,14 'yes'" \
            "$ASSETS_DIR/mask.png" -compose CopyOpacity -composite \
            "$ASSETS_DIR/good.png"

    # Create bad pill
    convert -size 90x20 xc:black -size 30x20 xc:red +append \
            -font "$SITE_ROOT/assets/fonts/Barlow/barlow-v12-latin-500.ttf" \
            -fill white -pointsize 12 \
            -draw "text 5,14 'reproducible:'" -draw "text 95,14 'no'" \
            "$ASSETS_DIR/mask.png" -compose CopyOpacity -composite \
            "$ASSETS_DIR/bad.png"
fi

# Process files function
process_file() {
    local yaml_file="$1"
    local platform="$2"
    verdict=$(grep -m 1 "verdict:" "$yaml_file" | cut -d':' -f2 | tr -d ' \r\n')
    base_name=$(basename "$yaml_file")
    base_name="${base_name%.*}"
    platform_dir="$ASSETS_DIR/$platform"
    mkdir -p "$platform_dir"
    output_file="$platform_dir/$base_name.png"
    
    case "$verdict" in
        "reproducible")
            echo -n "+"
            ln -sf "$ASSETS_DIR/good.png" "$output_file"
            ;;
        "nonverifiable"|"ftbfs"|"obfuscated")
            echo -n "-"
            ln -sf "$ASSETS_DIR/bad.png" "$output_file"
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
