import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

export const DEBUG = args.debug === true || args.debug === 'true';

export const DRY_RUN = args['dry-run'] === true || args['dry-run'] === 'true';

export const isDebugEnv = () => DEBUG;

export { args };
