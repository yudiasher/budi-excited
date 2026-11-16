// budi-excited — ai-excited-01 entry (Node 22, standard library only).
//
// The image beside this file is the entry: a lone figure on a cliff edge
// facing a colossal aurora vortex with a whale gliding inside its curl.
// This program copies it, byte for byte, to the harness output directory
// as entry.png. It is fully deterministic: the same input bytes always
// produce the same output bytes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

// The gate reads the first bytes: a PNG starts 89 50 4E 47, a JPEG FF D8 FF.
// Refuse to copy anything else, so a corrupt source can never ship.
const head = readFileSync(source).subarray(0, 4);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG (bad magic bytes)');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

copyFileSync(source, join(outDir, 'entry.png'));

// The gate refuses anything over 1 MiB: fail loudly here instead of
// silently shipping an entry that can never be judged.
const written = statSync(join(outDir, 'entry.png')).size;
if (written > 1048576) {
  throw new Error(`entry.png is ${written} bytes, over the 1 MiB gate`);
}
