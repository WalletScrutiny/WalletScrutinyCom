// Runs the per-repository jobs a few at a time, and tags every log line a job
// prints (including its container's output) with the job's name, so the
// interleaved output of parallel jobs in the journal stays readable.
import { AsyncLocalStorage } from 'async_hooks';

const logTag = new AsyncLocalStorage();
let consoleTagged = false;

// Prefix console.log/warn/error output with the tag of the job it runs in.
// Lines printed outside a job are left as they are.
export function tagConsole() {
  if (consoleTagged) return;
  consoleTagged = true;
  for (const method of ['log', 'info', 'warn', 'error']) {
    const original = console[method].bind(console);
    console[method] = (...args) => {
      const tag = logTag.getStore();
      if (tag === undefined) return original(...args);
      if (typeof args[0] === 'string') {
        // Tag every line of a multi-line message (blank lines included, so a
        // leading '\n' separator still reads as one job's output).
        return original(args[0].split('\n').map(line => `[${tag}] ${line}`).join('\n'), ...args.slice(1));
      }
      return original(`[${tag}]`, ...args);
    };
  }
}

// Call worker(item) for every item, at most `limit` at a time, in list order.
// `tagOf(item)` names the job in the log. Resolves to the workers' results in
// list order; a worker that throws stops nothing else, its error is its result.
export async function runPool(items, limit, worker, tagOf = () => undefined) {
  const results = new Array(items.length);
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await logTag.run(tagOf(items[i]), async () => {
        try {
          return await worker(items[i]);
        } catch (error) {
          return error;
        }
      });
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, Math.floor(limit) || 1), items.length) }, lane));
  return results;
}
