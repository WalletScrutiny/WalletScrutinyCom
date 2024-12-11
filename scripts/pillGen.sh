#!/bin/bash

process_file() {
    local yaml_file="$1"
    local platform="$2"
    verdict=$(grep -m 1 "verdict:" "$yaml_file" | cut -d':' -f2 | tr -d ' \r\n')
    base_name=$(basename "$yaml_file")
    base_name="${base_name%.*}"
    output_file="images/pills/$platform/$base_name.png"
    case "$verdict" in
        "reproducible")
            echo -n "+"
            cp /tmp/yes.png $output_file
            ;;
        "nonverifiable"|"ftbfs"|"obfuscated")
            echo -n "-"
            cp /tmp/no.png $output_file
            ;;
    esac
}

export -f process_file
convert -size 120x20 xc:black \
        -fill white -draw "roundrectangle 0,0 119,19 4,4" \
        /tmp/mask.png
convert -size 90x20 xc:black -size 30x20 xc:darkgreen +append \
        -font "assets/fonts/Barlow/barlow-v12-latin-500.ttf" \
        -fill white -pointsize 12 \
        -draw "text 5,14 'reproducible:'" -draw "text 95,14 'yes'" \
        /tmp/mask.png -compose CopyOpacity -composite /tmp/yes.png
convert -size 90x20 xc:black -size 30x20 xc:red +append \
        -font "assets/fonts/Barlow/barlow-v12-latin-500.ttf" \
        -fill white -pointsize 12 \
        -draw "text 5,14 'reproducible:'" -draw "text 95,14 'no'" \
        /tmp/mask.png -compose CopyOpacity -composite /tmp/no.png

for platform in android hardware; do
    echo "Processing platform: $platform"
    mkdir -p "images/pills/$platform/"
    rm "images/pills/$platform/*.png" > /dev/null 2>&1
    find "_$platform" -name "*.md" -type f -print0 | \
        parallel -0 process_file {} "$platform"
done
