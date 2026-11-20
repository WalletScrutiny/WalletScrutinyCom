// The "Dependencies" tab of /reproduced/, worked out from rebuilds.json, the file our
// dependency rebuilder (external/dep_rebuilder/site-export.mjs) publishes on the web host.
// One row per package version we rebuilt and got the file the registry serves.

const DAY = 24 * 3600;
const REGISTRY_PAGES = {
  npm: (name, version) => `https://www.npmjs.com/package/${name}/v/${encodeURIComponent(version)}`,
};

/** The registry page of a package version, or null for an ecosystem with no page we link to. */
export function registryUrl(ecosystem, name, version) {
  return REGISTRY_PAGES[ecosystem]?.(name, version) ?? null;
}

function dayToTimestamp(day) {
  const ms = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(ms) ? 0 : ms / 1000;
}

/**
 * [feed]: the parsed rebuilds.json. Reproduced versions newest first (more wallets first on the
 * same day), plus counts for the line above them. Returns null when the file is not the expected shape.
 */
export function dependencyRows(feed, now = Math.floor(Date.now() / 1000)) {
  if (feed?.schema !== 1 || !Array.isArray(feed.rows)) {
    return null;
  }
  const rows = [];
  for (const row of feed.rows) {
    if (typeof row?.name !== 'string' || typeof row.version !== 'string') {
      continue;
    }
    if (row.result === 'reproduced') {
      rows.push({
        ecosystem: row.ecosystem || 'npm',
        name: row.name,
        version: row.version,
        date: dayToTimestamp(row.date),
        wallets: Number.isInteger(row.wallets) ? row.wallets : null,
        note: typeof row.note === 'string' ? row.note : '',
        url: registryUrl(row.ecosystem || 'npm', row.name, row.version),
      });
    }
  }
  rows.sort((a, b) => b.date - a.date || (b.wallets ?? 0) - (a.wallets ?? 0) || a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
  return {
    rows,
    summary: {
      reproduced: rows.length,
      packages: new Set(rows.map(row => `${row.ecosystem}\n${row.name}`)).size,
      recent: rows.filter(row => row.date >= now - 30 * DAY).length,
    },
  };
}
