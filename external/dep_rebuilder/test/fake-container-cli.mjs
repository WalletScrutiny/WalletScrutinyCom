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
  if (process.env.FAKE_DIRECTORY) console.log(`== package directory: ${process.env.FAKE_DIRECTORY}`);
  if (process.env.FAKE_WORKSPACE === 'clone') console.log('== workspace member: the repository\'s root build is not run');
} else if (env.PHASE === 'install') {
  console.log('== node v20.0.0 npm 10.0.0');
} else if (env.PHASE === 'build') {
  const out = path.join(mount('/out'), 'x-1.0.0.tgz');
  if (process.env.FAKE_WORKSPACE === 'build') console.log('== workspace member: says the build about itself');
  if (mode === 'source-only') fs.copyFileSync(process.env.FAKE_SOURCE_TGZ, out); // what git has, without the built files
  if (mode.startsWith('after-build')) fs.copyFileSync(mode === 'after-build:first-is-published' ? process.env.FAKE_TGZ : process.env.FAKE_SOURCE_TGZ, out);
  if (mode === 'no-tarball') { console.log('npm error Missing script: "build"'); process.exit(1); }
  if (mode === 'ok') fs.copyFileSync(process.env.FAKE_TGZ, out);
  if (mode === 'pipe') execFileSync('mkfifo', [out]);
  if (mode === 'link') fs.symlinkSync(process.env.FAKE_TGZ, out);
  if (mode === 'garbage') fs.writeFileSync(out, 'not a tarball');
  if (mode === 'locked') { const d = path.join(mount('/work'), 'a'); fs.mkdirSync(path.join(d, 'b'), { recursive: true }); fs.writeFileSync(path.join(d, 'b', 'f'), 'x'.repeat(5000)); fs.chmodSync(d, 0o000); process.exit(1); }
  if (mode === 'flood') { const line = `${'x'.repeat(1023)}\n`; for (let i = 0; i < 3000; i++) fs.writeSync(1, line); fs.copyFileSync(process.env.FAKE_TGZ, out); }
} else if (env.PHASE === 'after-build') {
  // a "build" script no publish hook calls: the package packed again after it
  const again = path.join(mount('/out'), 'after-build.tgz');
  if (mode === 'after-build') fs.copyFileSync(process.env.FAKE_TGZ, again);
  if (mode === 'after-build:differs') fs.copyFileSync(process.env.FAKE_OTHER_TGZ, again);
  if (mode === 'after-build:link') fs.symlinkSync(process.env.FAKE_TGZ, again);
  if (mode === 'after-build:garbage') fs.writeFileSync(again, 'not a tarball');
  if (mode === 'after-build:fails') { fs.copyFileSync(process.env.FAKE_TGZ, again); console.log('npm error tsc: not found'); process.exit(1); }
}
