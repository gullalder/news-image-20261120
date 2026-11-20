import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const artwork = readFileSync(new URL('entry.png', import.meta.url));
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (artwork.length > 1048576 || artwork.length < 33 || !artwork.subarray(0, 8).equals(signature)) {
  throw new Error('The artwork must be a PNG no larger than 1 MiB.');
}
if (artwork.toString('ascii', 12, 16) !== 'IHDR' || artwork.readUInt32BE(16) !== 1024 || artwork.readUInt32BE(20) !== 1024) {
  throw new Error('The artwork must measure exactly 1024 × 1024.');
}
if (!artwork.subarray(-12).equals(Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]))) {
  throw new Error('The PNG is missing its final IEND chunk.');
}
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, 'entry.png'), artwork);
