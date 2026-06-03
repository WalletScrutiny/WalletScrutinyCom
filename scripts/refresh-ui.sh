# Shared terminal styling for the refresh pipeline.
#
#   print_refresh_section "title"       — main step (refresh.sh, before each script)
#   print_refresh_subsection "title"    — sub-step inside a script (less prominent)
#   print_refresh_note "message"        — indented detail line
#
# Node equivalent: scripts/refresh-ui.mjs

# Width of main section bars (═).
readonly REFRESH_UI_WIDTH=108
# Width of subsection bars (─); shorter and lighter than main sections.
readonly REFRESH_UI_SUBSECTION_WIDTH=72

_refresh_truncate() {
  local s="$1"
  local max="$2"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  if ((${#s} > max)); then
    printf '%s\u2026' "${s:0:max-1}"
  else
    printf '%s' "$s"
  fi
}

_refresh_bar() {
  local ch="$1" width="${2:-$REFRESH_UI_WIDTH}"
  printf -v _refresh_pad '%*s' "$width" ''
  _refresh_pad="${_refresh_pad// /$ch}"
  printf '%s\n' "$_refresh_pad"
}

# Main pipeline step — print immediately before running a script.
print_refresh_section() {
  local title
  title="$(_refresh_truncate "$1" $((REFRESH_UI_WIDTH - 4)))"
  echo
  _refresh_bar $'\u2550'
  printf '  %s\n' "$title"
  _refresh_bar $'\u2550'
}

# Sub-step — visible compact box (─), clearly below main sections (═).
print_refresh_subsection() {
  local title
  title="$(_refresh_truncate "$1" $((REFRESH_UI_SUBSECTION_WIDTH - 4)))"
  echo
  printf '  '
  _refresh_bar $'\u2500' "$REFRESH_UI_SUBSECTION_WIDTH"
  printf '    %s\n' "$title"
  printf '  '
  _refresh_bar $'\u2500' "$REFRESH_UI_SUBSECTION_WIDTH"
}

# Indented note (skip reasons, hints).
print_refresh_note() {
  printf '    %s\n' "$1"
}
