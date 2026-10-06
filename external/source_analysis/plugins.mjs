// Runs the source-analysis plugins (plugins/<name>.mjs) in the order and with
// the on/off switches of PLUGINS in config.mjs.
//
// A plugin file default-exports an object with any of:
//   description        one line, what it does
//   requires           names of plugins whose results it reads; they must be
//                      enabled and listed before it
//   needsKnownAppType  true: skipped when no ecosystem was detected
//   container(ctx)     runs INSIDE the analysis container, on the checkout;
//                      its return value (JSON) becomes ctx.results[name]
//   host(ctx)          runs on the host after the container, on the same
//                      checkout; its return value replaces ctx.results[name]
//                      when it is not undefined
// The container steps of all plugins run first, then the host steps, each in
// the configured order (the host steps need what the container returned).
// A step that throws fails the analysis: the error is logged, the remaining
// plugins still run, except those that require the failed one (and its own
// host step, when its container step threw).
//
// Container steps only get pure-JS imports (see containerEntry.mjs); a host
// step that needs the database imports ddbbUtils.mjs lazily, inside host().
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLUGINS, APP_TYPES } from './config.mjs';

export const PLUGINS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'plugins');

/**
 * The enabled plugins, in the configured order. Throws on a configuration
 * that cannot work: a listed plugin without a file, a plugin file missing
 * from the list, or a plugin that requires one that is off or comes later.
 */
export async function loadPlugins(config = PLUGINS, dir = PLUGINS_DIR) {
  const listed = Object.keys(config);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).map(f => f.slice(0, -4));
  const problems = [];
  for (const name of listed) {
    if (!files.includes(name)) problems.push(`'${name}' is in PLUGINS but there is no plugins/${name}.mjs`);
  }
  for (const name of files) {
    if (!listed.includes(name)) problems.push(`plugins/${name}.mjs is not in PLUGINS (add it, enabled or not)`);
  }
  if (problems.length) throw new Error(`Plugin configuration: ${problems.join('; ')}`);

  const enabled = listed.filter(name => config[name]);
  const plugins = [];
  for (const name of enabled) {
    const { default: plugin } = await import(path.join(dir, `${name}.mjs`));
    if (!plugin || (typeof plugin.container !== 'function' && typeof plugin.host !== 'function')) {
      throw new Error(`Plugin configuration: plugins/${name}.mjs exports neither container() nor host()`);
    }
    for (const required of plugin.requires || []) {
      if (!enabled.slice(0, enabled.indexOf(name)).includes(required)) {
        problems.push(`'${name}' requires '${required}', which must be enabled and listed before it`);
      }
    }
    plugins.push({ name, ...plugin });
  }
  if (problems.length) throw new Error(`Plugin configuration: ${problems.join('; ')}`);
  return plugins;
}

/**
 * Run one phase ('container' or 'host') of every plugin that has it.
 * ctx.results collects what each plugin returns, ctx.failed the plugins that
 * threw ({ plugin, error }); both carry over from the container to the host.
 */
export async function runPlugins(plugins, phase, ctx) {
  ctx.results ||= {};
  ctx.failed ||= [];
  for (const plugin of plugins) {
    if (typeof plugin[phase] !== 'function') continue;
    if (plugin.needsKnownAppType && ctx.appType === APP_TYPES.UNKNOWN) continue;
    if (ctx.failed.some(f => f.plugin === plugin.name)) continue; // its container step failed
    const missing = (plugin.requires || []).filter(r => ctx.failed.some(f => f.plugin === r));
    if (missing.length) {
      console.log(`Plugin ${plugin.name}: skipped, ${missing.join(', ')} failed`);
      ctx.failed.push({ plugin: plugin.name, error: `skipped: ${missing.join(', ')} failed` });
      continue;
    }
    try {
      const value = await plugin[phase](ctx);
      if (value !== undefined) ctx.results[plugin.name] = value;
    } catch (error) {
      console.error(`Plugin ${plugin.name} (${phase}) failed: ${error.message}`);
      ctx.failed.push({ plugin: plugin.name, error: error.message });
    }
  }
  return ctx;
}
