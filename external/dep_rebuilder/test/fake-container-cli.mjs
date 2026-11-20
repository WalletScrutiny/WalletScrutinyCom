#!/usr/bin/env node
// Stands in for podman in the tests: reads the arguments rebuild.mjs passes and
// does what FAKE_BUILD says a hostile or broken build would do.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const args = process.argv.slice(2);
if (args[0] !== 'run') process.exit(0); // rm -f of a container
const env = Object.fromEntries(args.flatMap((a, i) => (args[i - 1] === '-e' ? [a.split(/=(.*)/s).slice(0, 2)] : [])));
const mount = (inside) => args.find((a, i) => args[i - 1] === '-v' && a.endsWith(`:${inside}:rw`))?.slice(0, -`:${inside}:rw`.length);
const mode = process.env.FAKE_BUILD || 'ok';
fs.appendFileSync(process.env.FAKE_CALLS, `${JSON.stringify(env)}\n`);

if (env.PHASE === 'clone') {
  if (mode === 'clone-fails') { console.log('fatal: unable to access the repository'); process.exit(128); }
  console.log(`commit ${'c'.repeat(40)} 2026-01-01T00:00:00+00:00`);
} else if (env.PHASE === 'install') {
  console.log('== node v20.0.0 npm 10.0.0');
} else if (env.PHASE === 'build') {
  const out = path.join(mount('/out'), 'x-1.0.0.tgz');
  if (mode === 'ok') fs.copyFileSync(process.env.FAKE_TGZ, out);
  if (mode === 'pipe') execFileSync('mkfifo', [out]);
  if (mode === 'link') fs.symlinkSync(process.env.FAKE_TGZ, out);
  if (mode === 'garbage') fs.writeFileSync(out, 'not a tarball');
  if (mode === 'locked') { const d = path.join(mount('/work'), 'a'); fs.mkdirSync(path.join(d, 'b'), { recursive: true }); fs.writeFileSync(path.join(d, 'b', 'f'), 'x'.repeat(5000)); fs.chmodSync(d, 0o000); process.exit(1); }
  if (mode === 'flood') { const line = `${'x'.repeat(1023)}\n`; for (let i = 0; i < 3000; i++) fs.writeSync(1, line); fs.copyFileSync(process.env.FAKE_TGZ, out); }
}
