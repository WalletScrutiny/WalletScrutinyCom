// One writer of the database and the export at a time.
//
// A pass (index.mjs, the 6-hourly timer or a manual run) and the hourly
// advisory refresh (refresh-cli.mjs) both rewrite index.json and app files and
// publish them. Run together, one's index.json entries are lost, and a refresh
// writing while the pass swaps the export directory writes into the old one.
// Both take this lock: the refresh skips when it is held, a pass waits for it
// (a refresh takes minutes). The file holds the owner's pid; a file whose pid
// is gone (a killed run) is taken over.
import fs from 'fs';
import path from 'path';

export const lockPathFor = (dbPath) => `${path.resolve(dbPath)}.lock`;

// A recycled pid would hold the lock forever, so on Linux it must also be node.
function alive(pid) {
  try {
    process.kill(pid, 0);
  } catch (error) {
    if (error.code !== 'EPERM') return false;
  }
  try {
    return fs.readFileSync(`/proc/${pid}/comm`, 'utf8').trim() === 'node';
  } catch {
    return true; // no /proc: trust the pid
  }
}

/**
 * Takes the lock once: { release } when taken, { holder } (the owner's pid)
 * when another live process holds it.
 */
export function tryLock(file, { pid = process.pid, isAlive = alive } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    // Written aside and linked into place: a reader never sees it without the pid.
    const tmp = `${file}.${pid}.tmp`;
    fs.writeFileSync(tmp, `${pid}\n`);
    try {
      fs.linkSync(tmp, file);
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        process.off('exit', release);
        try { if (fs.readFileSync(file, 'utf8').trim() === String(pid)) fs.unlinkSync(file); } catch { /* already gone */ }
      };
      process.on('exit', release); // process.exit() anywhere still frees it
      return { release };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    } finally {
      fs.rmSync(tmp, { force: true });
    }
    let holder;
    try { holder = Number.parseInt(fs.readFileSync(file, 'utf8'), 10); } catch { continue; } // released meanwhile
    if (Number.isInteger(holder) && holder > 0 && isAlive(holder)) return { holder };
    fs.rmSync(file, { force: true }); // a dead owner's lock
  }
  throw new Error(`could not take ${file}`);
}

/** Waits until the lock is free, polling; returns the release function. */
export async function waitForLock(file, { pollMs = 5000, log = console, ...opts } = {}) {
  let told = false;
  for (;;) {
    const { release, holder } = tryLock(file, opts);
    if (release) return release;
    if (!told) log.log(`Waiting for process ${holder} to finish (${file})...`);
    told = true;
    await new Promise(r => setTimeout(r, pollMs));
  }
}
