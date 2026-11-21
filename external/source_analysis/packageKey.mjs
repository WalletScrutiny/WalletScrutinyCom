// The one key that says two dependency rows are the same package (issue 1027):
// the export counts by it, and the pip rules compare source and pinned files
// with it, so the two cannot disagree.
//
// Only pip names are folded. PyPI treats case and runs of `-`, `_` and `.` as
// one name (PEP 503), and `trezor[hidapi]` is `trezor` with extras. Other
// ecosystems keep their names as stored: Maven's `group:artifact` is
// case-sensitive and its dots are part of the group. Versions stay as stored.

export function foldName(ecosystem, name) {
  const n = String(name ?? '');
  if (ecosystem !== 'pip') return n;
  return n.replace(/\[.*\]$/, '').trim().toLowerCase().replace(/[-_.]+/g, '-');
}

export const packageKey = (ecosystem, name, version) => `${ecosystem}:${foldName(ecosystem, name)}@${version ?? ''}`;
