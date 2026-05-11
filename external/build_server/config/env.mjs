import minimist from 'minimist';

// Detect debug mode once at module load. ES modules are evaluated only once
// per process, so this runs a single time even if many modules import it.
// Kept dependency-free so it can be imported from anywhere (including logger
// and constants) without creating circular imports.
const args = minimist(process.argv.slice(2));

export const DEBUG = args.debug === true || args.debug === 'true';

export const isDebugEnv = () => DEBUG;
