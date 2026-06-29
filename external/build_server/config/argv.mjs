import minimist from 'minimist';

// Parsed once at module load. Kept free of imports from the rest of build_server
// so logger, config, and nostr-constants can read CLI flags without circular deps.
export const args = minimist(process.argv.slice(2));

export const DEBUG = args.debug === true || args.debug === 'true';

export const isDebugEnv = () => DEBUG;
