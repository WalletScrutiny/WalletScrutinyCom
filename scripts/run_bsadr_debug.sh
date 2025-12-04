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

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

GITHUB_TOKEN_VALUE="${GITHUB_TOKEN:-}"
NOSTR_PK_VALUE="${WS_BOT_NOSTR_PK:-}"
APP_INFO_SOURCE_VALUE="${APP_INFO_SOURCE:-${ROOT_DIR}/buildServerInfo.seed.json}"
BUILD_DIR_VALUE="${BUILD_DIR_OVERRIDE:-${ROOT_DIR}/build_server_builds}"

IFS=',' read -r -a INITIAL_APPS <<< "${DEBUG_APPS:-}"
APPS=()
for app in "${INITIAL_APPS[@]}"; do
  [[ -n "${app// }" ]] && APPS+=("${app// /}")
done

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
  read -rp "App info source [${APP_INFO_SOURCE_VALUE}]: " input
  [[ -n "${input}" ]] && APP_INFO_SOURCE_VALUE="${input}"
}

prompt_build_dir() {
  read -rp "Build output directory [${BUILD_DIR_VALUE}]: " input
  [[ -n "${input}" ]] && BUILD_DIR_VALUE="${input}"
}

show_defaults() {
  cat <<EOF
Current configuration:
  GitHub token set: $([[ -n "${GITHUB_TOKEN_VALUE}" ]] && echo "yes" || echo "no")
  Nostr private key set: $([[ -n "${NOSTR_PK_VALUE}" ]] && echo "yes" || echo "no")
  App info source: ${APP_INFO_SOURCE_VALUE}
  Build output directory: ${BUILD_DIR_VALUE}
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
    --debug
  )

  if [[ -n "${APP_INFO_SOURCE_VALUE}" ]]; then
    cmd+=(--appInfo "${APP_INFO_SOURCE_VALUE}")
  fi

  echo "Running BSADR debug build..."
  echo "  Apps: ${apps_joined}"
  echo "  App info source: ${APP_INFO_SOURCE_VALUE}"
  echo "  Build output directory: ${BUILD_DIR_VALUE}"

  "${cmd[@]}"
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
    cat <<EOF_MENU
======== BSADR Debug Menu ========
1) Edit GitHub token
2) Edit WS bot Nostr private key
3) Set app info source (current: ${APP_INFO_SOURCE_VALUE})
4) Set build output directory (current: ${BUILD_DIR_VALUE})
5) Show current configuration
6) Show apps list
7) Add app
8) Remove app
9) Run build
0) Quit
EOF_MENU
    read -rp "Choose an option: " choice
    case "${choice}" in
      1) prompt_token ;;
      2) prompt_pk ;;
      3) prompt_app_info ;;
      4) prompt_build_dir ;;
      5) show_defaults ;;
      6) show_apps ;;
      7) add_app ;;
      8) remove_app ;;
      9)
        if run_build; then
          break
        fi
        ;;
      0) exit 0 ;;
      *) echo "Invalid choice." ;;
    esac
    echo
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
