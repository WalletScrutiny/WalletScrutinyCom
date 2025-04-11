#!/bin/bash
# Script to check ALL apps marked as 'meta: removed' on both Play Store and App Store
# Handles redirects for iOS App Store checks
# No CSV output

# Directories containing app markdown files
ANDROID_DIR="_android"
IOS_DIR="_iphone"

# Check if we're in the right directory
if [ ! -d "$ANDROID_DIR" ]; then
  echo "Warning: $_android directory not found. Skipping Android apps."
  CHECK_ANDROID=false
else
  CHECK_ANDROID=true
fi

if [ ! -d "$IOS_DIR" ]; then
  echo "Warning: $_iphone directory not found. Skipping iOS apps."
  CHECK_IOS=false
else
  CHECK_IOS=true
fi

if [ "$CHECK_ANDROID" = false ] && [ "$CHECK_IOS" = false ]; then
  echo "Error: Neither Android nor iOS directories found. Make sure you're running the script from the project root."
  exit 1
fi

# Function to check if Android app exists in Play Store
check_play_store() {
  local app_id="$1"
  local http_code=$(curl -s -o /dev/null -w "%{http_code}" "https://play.google.com/store/apps/details?id=$app_id")
  if [ "$http_code" -eq 200 ]; then
    return 0 # Success
  else
    return 1 # Not found
  fi
}

# Function to check if iOS app exists in App Store
check_app_store() {
  local app_id="$1"
  
  # Skip empty app IDs
  if [ -z "$app_id" ]; then
    return 1
  fi
  
  # Check if app_id is numeric
  if [[ "$app_id" =~ ^[0-9]+$ ]]; then
    # Already a numeric ID
    local url="https://apps.apple.com/app/id$app_id"
    # Use -L to follow redirects
    local http_code=$(curl -L -s -o /dev/null -w "%{http_code}" "$url")
    echo "Checking iOS App Store URL: $url - Response: $http_code"
    
    # Consider 200 or 301/302/307/308 (redirects) as success
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ] || [ "$http_code" -eq 308 ]; then
      return 0 # Success
    else
      return 1 # Not found
    fi
  else
    # Not a numeric ID - try a search on App Store
    # We'll use a basic lookup on iTunes API to find the app by bundle ID
    local search_url="https://itunes.apple.com/lookup?bundleId=$app_id"
    echo "Looking up bundle ID: $app_id on iTunes API"
    local response=$(curl -s "$search_url")
    
    # Check if there are results
    if [[ "$response" == *"resultCount\":1"* ]]; then
      # Extract the numeric app ID
      local numeric_id=$(echo "$response" | grep -o '"trackId":[0-9]*' | grep -o '[0-9]*')
      echo "Found numeric App Store ID: $numeric_id for bundle $app_id"
      
      # Now check the app store with this numeric ID
      local url="https://apps.apple.com/app/id$numeric_id"
      # Use -L to follow redirects
      local http_code=$(curl -L -s -o /dev/null -w "%{http_code}" "$url")
      echo "Checking iOS App Store URL: $url - Response: $http_code"
      
      # Consider 200 or 301/302/307/308 (redirects) as success
      if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ] || [ "$http_code" -eq 308 ]; then
        # Save the numeric ID for display
        APP_STORE_ID="$numeric_id"
        APP_STORE_URL="$url"
        return 0 # Success
      fi
    fi
    
    echo "Bundle ID $app_id not found in App Store"
    return 1 # Not found
  fi
}

# Initialize counters
android_found=0
ios_found=0
android_updated=0
ios_updated=0
android_checked=0
ios_checked=0

# Check Android apps if directory exists
if [ "$CHECK_ANDROID" = true ]; then
  echo "Finding all Android apps with meta: removed..."
  android_removed_apps=$(grep -l "meta:.*removed" "$ANDROID_DIR"/*.md 2>/dev/null)

  if [ -z "$android_removed_apps" ]; then
    echo "No Android apps with 'meta: removed' found."
  else
    echo "Checking Play Store availability for removed Android apps..."
    for file in $android_removed_apps; do
      filename=$(basename "$file")
      
      # Extract app ID
      app_id=$(grep -o "appId:.*" "$file" | sed 's/appId: *//g' | tr -d '\r')
      
      # Skip if app_id is empty
      if [ -z "$app_id" ]; then
        continue
      fi
      
      # Extract title
      title=$(grep -o "title:.*" "$file" | sed 's/title: *//g' | tr -d '\r' | sed 's/"/\\"/g')
      
      # Extract repository
      repository=$(grep -o "repository:.*" "$file" | sed 's/repository: *//g' | tr -d '\r')
      
      # Check Play Store status
      ((android_checked++))
      echo "Checking Android: $app_id... ($android_checked checked)"
      if check_play_store "$app_id"; then
        store_link="https://play.google.com/store/apps/details?id=$app_id"
        
        # Try to update the file automatically
        updated="No"
        if sed -i 's/meta:.*removed/meta: ok/g' "$file"; then
          updated="Yes"
          ((android_updated++))
        fi
        
        ((android_found++))
        echo "FOUND ANDROID: $title ($app_id)"
        echo "  Play Store: $store_link"
        echo "  Repository: $repository"
        echo "  Updated: $updated"
        echo ""
      fi
    done
  fi
fi

# Check iOS apps if directory exists
if [ "$CHECK_IOS" = true ]; then
  echo -e "\nFinding all iOS apps with meta: removed..."
  # Count how many iOS apps have meta: removed
  ios_removed_count=$(grep -l "meta:.*removed" "$IOS_DIR"/*.md 2>/dev/null | wc -l)
  echo "Found $ios_removed_count iOS apps with meta: removed"
  
  ios_removed_apps=$(grep -l "meta:.*removed" "$IOS_DIR"/*.md 2>/dev/null)

  if [ -z "$ios_removed_apps" ]; then
    echo "No iOS apps with 'meta: removed' found."
  else
    echo "Checking App Store availability for removed iOS apps..."
    for file in $ios_removed_apps; do
      filename=$(basename "$file")
      
      echo "Processing iOS file: $filename"
      
      # Try multiple ways to find App Store ID
      app_id=""
      
      # Try numeric ID first - look for idd field which often contains the numeric ID
      idd=$(grep -o "idd:.*" "$file" | sed 's/idd: *//g' | tr -d '\r')
      if [[ "$idd" =~ ^[0-9]+$ ]]; then
        app_id="$idd"
        echo "Found numeric App Store ID: $app_id"
      fi
      
      # If no numeric ID, look for bundle ID
      if [ -z "$app_id" ]; then
        bundle_id=$(grep -o "appId:.*" "$file" | sed 's/appId: *//g' | tr -d '\r')
        if [ -n "$bundle_id" ]; then
          app_id="$bundle_id"
          echo "Found bundle ID: $app_id"
        fi
      fi
      
      # If still no ID, try to extract from the Apple URL if exists
      if [ -z "$app_id" ]; then
        app_store_url=$(grep -o "appstore:.*" "$file" | sed 's/appstore: *//g' | tr -d '\r')
        if [ -n "$app_store_url" ]; then
          id_from_url=$(echo "$app_store_url" | grep -o "id[0-9]*" | sed 's/id//')
          if [ -n "$id_from_url" ]; then
            app_id="$id_from_url"
            echo "Extracted App Store ID from URL: $app_id"
          fi
        fi
      fi
      
      # Skip if app_id is empty
      if [ -z "$app_id" ]; then
        echo "  Skipping: No app ID found"
        continue
      fi
      
      # Extract title
      title=$(grep -o "title:.*" "$file" | sed 's/title: *//g' | tr -d '\r' | sed 's/"/\\"/g')
      
      # Extract repository
      repository=$(grep -o "repository:.*" "$file" | sed 's/repository: *//g' | tr -d '\r')
      
      # Check App Store status
      ((ios_checked++))
      echo "Checking iOS: $app_id... ($ios_checked checked)"
      
      # Reset global variables
      APP_STORE_ID=""
      APP_STORE_URL=""
      
      if check_app_store "$app_id"; then
        # If APP_STORE_ID was set by the function, use it; otherwise use the original app_id
        store_id="${APP_STORE_ID:-$app_id}"
        store_link="${APP_STORE_URL:-https://apps.apple.com/app/id$store_id}"
        
        # Try to update the file automatically
        updated="No"
        if sed -i 's/meta:.*removed/meta: ok/g' "$file"; then
          updated="Yes"
          ((ios_updated++))
        fi
        
        ((ios_found++))
        echo "FOUND iOS: $title ($store_id)"
        echo "  App Store: $store_link"
        echo "  Repository: $repository"
        echo "  Updated: $updated"
        echo ""
      fi
    done
  fi
fi

# Print summary
echo -e "\n----- SUMMARY -----"
if [ "$CHECK_ANDROID" = true ]; then
  echo "Checked $android_checked Android apps marked as 'meta: removed'"
  echo "Found $android_found Android apps that are still available"
  echo "Automatically updated $android_updated Android files from 'meta: removed' to 'meta: ok'"
fi

if [ "$CHECK_IOS" = true ]; then
  echo "Checked $ios_checked iOS apps marked as 'meta: removed'"
  echo "Found $ios_found iOS apps that are still available"
  echo "Automatically updated $ios_updated iOS files from 'meta: removed' to 'meta: ok'"
fi

total_found=$((android_found + ios_found))
if [ $total_found -gt 0 ]; then
  echo "Found and updated $total_found apps total"
else
  echo "No apps need to be updated."
fi