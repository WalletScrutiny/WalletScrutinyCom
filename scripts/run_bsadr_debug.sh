#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: run_bsadr_debug.sh [--help] [--no-tui]

Interactive (TUI) mode is the default. It lets you:
  • Enter or edit the GitHub token and Nostr private key
  • Set or inspect the buildServerInfo seed source path/URL
  • View defaults for all settings
  • Inspect, add, or remove appIds that will run
  • Launch a single-run debug build with the chosen configuration

Environment variables respected:
  GITHUB_TOKEN        Pre-populates the GitHub token field.
  WS_BOT_NOSTR_PK     Pre-populates the Nostr private key field.
  DEBUG_APPS          Comma-separated list of appIds used to seed the list.
  APP_INFO_SOURCE     Default path/URL for buildServerInfo (else buildServerInfo.seed.json).
  BUILD_DIR_OVERRIDE  Directory for build outputs (else ./build_server_builds).

Non-interactive mode:
  Provide all env vars (including DEBUG_APPS) and run with --no-tui to launch immediately.
EOF
}

SCRIPT_VERSION="v0.0.2"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
USE_TUI=true

GITHUB_TOKEN_VALUE="${GITHUB_TOKEN:-}"
NOSTR_PK_VALUE="${WS_BOT_NOSTR_PK:-}"
APP_INFO_SOURCE_VALUE="${APP_INFO_SOURCE:-${ROOT_DIR}/buildServerInfo.seed.json}"
BUILD_DIR_VALUE="${BUILD_DIR_OVERRIDE:-${ROOT_DIR}/build_server_builds}"

RUN_MODE="${BSADR_MODE:-dry}"
IS_DEBUG_RUN=true
if [[ "${RUN_MODE,,}" == "production" ]]; then
  IS_DEBUG_RUN=false
fi

IFS=',' read -r -a INITIAL_APPS <<< "${DEBUG_APPS:-}"
APPS=()
for app in "${INITIAL_APPS[@]}"; do
  [[ -n "${app// }" ]] && APPS+=("${app// /}")
done

clear_screen() {
  if [[ "${USE_TUI}" != "true" ]]; then
    return
  fi
  if command -v tput >/dev/null 2>&1; then
    tput clear
  else
    printf '\033c'
  fi
}

pause_for_enter() {
  if [[ "${USE_TUI}" == "true" ]]; then
    read -rp "Press Enter to return to the menu..." _
  fi
}

join_apps() {
  local IFS=','; echo "${APPS[*]}"
}

show_apps() {
  if [[ ${#APPS[@]} -eq 0 ]]; then
    echo "Apps list is empty."
  else
    printf 'Apps to build (%d):\n' "${#APPS[@]}"
    local idx=1
    for app in "${APPS[@]}"; do
      printf '  %d. %s\n' "${idx}" "${app}"
      ((idx++))
    done
  fi
}

add_app() {
  read -rp "Enter appId to add: " new_app
  new_app="${new_app// /}"
  if [[ -z "${new_app}" ]]; then
    echo "No appId entered."
    return
  fi
  for app in "${APPS[@]}"; do
    if [[ "${app}" == "${new_app}" ]]; then
      echo "App ${new_app} already in list."
      return
    fi
  done
  APPS+=("${new_app}")
  echo "Added ${new_app}."
}

remove_app() {
  if [[ ${#APPS[@]} -eq 0 ]]; then
    echo "Apps list is empty."
    return
  fi
  show_apps
  read -rp "Enter number to remove: " idx
  if ! [[ "${idx}" =~ ^[0-9]+$ ]] || (( idx < 1 || idx > ${#APPS[@]} )); then
    echo "Invalid selection."
    return
  fi
  local removed="${APPS[idx-1]}"
  unset 'APPS[idx-1]'
  APPS=("${APPS[@]}")
  echo "Removed ${removed}."
}

prompt_token() {
  read -rsp "GitHub token (current hidden): " input
  echo
  [[ -n "${input}" ]] && GITHUB_TOKEN_VALUE="${input}"
}

prompt_pk() {
  read -rsp "WS bot Nostr private key (current hidden): " input
  echo
  [[ -n "${input}" ]] && NOSTR_PK_VALUE="${input}"
}

prompt_app_info() {
  local current="${APP_INFO_SOURCE_VALUE}"
  local seed_path="${ROOT_DIR}/buildServerInfo.seed.json"
  local jekyll_path="${ROOT_DIR}/_site/assets/js/json/buildServerInfo.json"
  local suggestion=""

  # Smart default: suggest the "other" option
  if [[ "${current}" == *"seed.json"* ]]; then
    suggestion="${jekyll_path}"
  else
    suggestion="${seed_path}"
  fi

  echo "Current: ${current}"
  echo "  1) ${seed_path} (manual test file)"
  echo "  2) ${jekyll_path} (auto-generated from .md files)"
  read -rp "App info source [${suggestion}]: " input

  if [[ -z "${input}" ]]; then
    # User pressed Enter, use suggestion
    APP_INFO_SOURCE_VALUE="${suggestion}"
  else
    # User entered custom path
    APP_INFO_SOURCE_VALUE="${input}"
  fi

  # Auto-rebuild if Jekyll path selected
  if [[ "${APP_INFO_SOURCE_VALUE}" == *"_site/assets/js/json/buildServerInfo.json" ]]; then
    echo "Rebuilding Jekyll to ensure fresh buildServerInfo.json..."
    if (cd "${ROOT_DIR}" && bundle exec jekyll build --quiet 2>&1 | tail -3); then
      echo "✓ Jekyll build complete"
    else
      echo "⚠ Warning: Jekyll build had issues, but continuing..."
    fi
  fi
}

prompt_build_dir() {
  read -rp "Build output directory [${BUILD_DIR_VALUE}]: " input
  [[ -n "${input}" ]] && BUILD_DIR_VALUE="${input}"
}

mode_label() {
  if [[ "${IS_DEBUG_RUN}" == "true" ]]; then
    echo "Dry Run"
  else
    echo "Production"
  fi
}

toggle_mode() {
  if [[ "${IS_DEBUG_RUN}" == "true" ]]; then
    IS_DEBUG_RUN=false
    RUN_MODE="production"
    echo "Switched to Production mode."
  else
    IS_DEBUG_RUN=true
    RUN_MODE="dry"
    echo "Switched to Dry Run mode."
  fi
}

show_defaults() {
  cat <<EOF
Current configuration:
  GitHub token set: $([[ -n "${GITHUB_TOKEN_VALUE}" ]] && echo "yes" || echo "no")
  Nostr private key set: $([[ -n "${NOSTR_PK_VALUE}" ]] && echo "yes" || echo "no")
  App info source: ${APP_INFO_SOURCE_VALUE}
  Build output directory: ${BUILD_DIR_VALUE}
  Run mode: $(mode_label)
EOF
  show_apps
}

run_build() {
  if [[ -z "${GITHUB_TOKEN_VALUE}" ]]; then
    echo "GitHub token is required."
    return 1
  fi
  if [[ -z "${NOSTR_PK_VALUE}" ]]; then
    echo "WS bot Nostr private key is required."
    return 1
  fi
  if [[ ${#APPS[@]} -eq 0 ]]; then
    echo "Add at least one app to run."
    return 1
  fi

  local apps_joined
  apps_joined="$(join_apps)"

  export DEBUG_APP_IDS="${apps_joined}"
  export BUILD_DIR_OVERRIDE="${BUILD_DIR_VALUE}"
  mkdir -p "${BUILD_DIR_VALUE}"

  local cmd=(
    node "${ROOT_DIR}/external/build_server/index.mjs"
    --githubToken "${GITHUB_TOKEN_VALUE}"
    --wsBotNostrPrivateKey "${NOSTR_PK_VALUE}"
    --singleRun
  )

  if [[ "${IS_DEBUG_RUN}" == "true" ]]; then
    cmd+=(--debug)
  fi

  if [[ -n "${APP_INFO_SOURCE_VALUE}" ]]; then
    cmd+=(--appInfo "${APP_INFO_SOURCE_VALUE}")
  fi

  clear_screen
  echo "Running BSADR $(mode_label) build..."
  echo "  Apps: ${apps_joined}"
  echo "  App info source: ${APP_INFO_SOURCE_VALUE}"
  echo "  Build output directory: ${BUILD_DIR_VALUE}"
  echo "  Mode: $(mode_label)"

  "${cmd[@]}"
  pause_for_enter
}

run_non_interactive() {
  if [[ -z "${GITHUB_TOKEN_VALUE}" || -z "${NOSTR_PK_VALUE}" || ${#APPS[@]} -eq 0 ]]; then
    echo "Non-interactive mode requires GITHUB_TOKEN, WS_BOT_NOSTR_PK, and DEBUG_APPS."
    exit 1
  fi
  run_build
  exit 0
}

menu_loop() {
  while true; do
    clear_screen
    cat <<EOF_MENU
======== BSADR Debug Menu (${SCRIPT_VERSION}) ========
1) Edit GitHub token
2) Edit WS bot Nostr private key
3) Set app info source (current: ${APP_INFO_SOURCE_VALUE})
4) Set build output directory (current: ${BUILD_DIR_VALUE})
5) Toggle run mode (current: $(mode_label))
6) Show current configuration
7) Show apps list
8) Add app
9) Remove app
10) Run build
0) Quit
EOF_MENU
    read -rp "Choose an option: " choice
    case "${choice}" in
      1) prompt_token; pause_for_enter ;;
      2) prompt_pk; pause_for_enter ;;
      3) prompt_app_info; pause_for_enter ;;
      4) prompt_build_dir; pause_for_enter ;;
      5) toggle_mode; pause_for_enter ;;
      6) show_defaults; pause_for_enter ;;
      7) show_apps; pause_for_enter ;;
      8) add_app; pause_for_enter ;;
      9) remove_app; pause_for_enter ;;
      10)
        if run_build; then
          break
        fi
        ;;
      0) exit 0 ;;
      *) echo "Invalid choice." ;;
    esac
  done
}

NO_TUI=false

for arg in "$@"; do
  case "${arg}" in
    --help|-h)
      usage
      exit 0
      ;;
    --no-tui)
      NO_TUI=true
      USE_TUI=false
      ;;
    *)
      echo "Unknown argument: ${arg}"
      usage
      exit 1
      ;;
  esac
done

if "${NO_TUI}"; then
  run_non_interactive
else
  menu_loop
fi
