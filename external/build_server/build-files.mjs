import fs from 'fs';
import path from 'path';

const { O_RDONLY, O_NOFOLLOW, O_NONBLOCK } = fs.constants;

// COMPARISON_RESULTS.yaml and build-lock.json are a few KB; a cast of a long
// build can reach tens of MB.
export const MAX_BUILD_FILE_BYTES = 256 * 1024 * 1024;

/**
 * Read a file that a build script could have written or replaced, from inside
 * baseDir. ABS can read files the script cannot (its credentials, the bot key),
 * so a script that swaps the file for a link to one of them would otherwise get
 * ABS to publish it. Checking first and reading after loses a race against a
 * script that keeps swapping the file, so the checks run on the opened file:
 * - O_NOFOLLOW refuses a symlink as the file itself;
 * - /proc/self/fd says where the opened file really is, which catches a parent
 *   folder swapped for a link to somewhere else;
 * - a hard link (more than one link) and anything but a regular file are
 *   refused; O_NONBLOCK keeps a FIFO from blocking the open;
 * - the file must be on the same filesystem as baseDir, which refuses a FUSE
 *   mount in the build folder.
 * Throws on refusal. Returns a Buffer, or a string with `encoding`.
 */
export function readBuildFileSync(baseDir, filePath, { encoding = null, maxBytes = MAX_BUILD_FILE_BYTES } = {}) {
  const base = fs.realpathSync(baseDir);
  const baseStat = fs.statSync(base);
  const fd = fs.openSync(filePath, O_RDONLY | O_NOFOLLOW | O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile()) {
      throw new Error(`refusing to read ${filePath}: not a regular file`);
    }
    if (stat.nlink !== 1) {
      throw new Error(`refusing to read ${filePath}: it has ${stat.nlink} links`);
    }
    if (stat.dev !== baseStat.dev) {
      throw new Error(`refusing to read ${filePath}: it is on another filesystem than ${base}`);
    }
    const realPath = fs.readlinkSync(`/proc/self/fd/${fd}`);
    if (!realPath.startsWith(base + path.sep)) {
      throw new Error(`refusing to read ${filePath}: it is outside ${base} (${realPath})`);
    }
    // Read to EOF but never past maxBytes: a leftover process can keep
    // appending to the file after fstat.
    const chunks = [];
    let total = 0;
    const chunk = Buffer.alloc(1024 * 1024);
    for (;;) {
      const n = fs.readSync(fd, chunk, 0, chunk.length, null);
      if (n === 0) break;
      total += n;
      if (total > maxBytes) {
        throw new Error(`refusing to read ${filePath}: larger than ${maxBytes} bytes`);
      }
      chunks.push(Buffer.from(chunk.subarray(0, n)));
    }
    const content = Buffer.concat(chunks, total);
    return encoding ? content.toString(encoding) : content;
  } finally {
    fs.closeSync(fd);
  }
}
