// Parsed once at module load. Kept free of imports from the rest of build_server
// so logger, config, and nostr-constants can read CLI flags without circular deps.
function parseArgv(argv) {
  const args = {};
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      const key = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      const value = eq === -1 ? true : arg.slice(eq + 1);
      if (key) args[key] = value;
    }
  }
  return args;
}

export const args = parseArgv(process.argv.slice(2));

export const DEBUG = args.debug === true || args.debug === 'true';

export const isDebugEnv = () => DEBUG;
