// Builds public/favicon.ico from public/favicon.svg (PNG-in-ICO, 32px + 16px).
// Run once: node scripts/favicon.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg');
const sizes = [32, 16];
const pngs = await Promise.all(sizes.map((s) => sharp(svg).resize(s, s).png().toBuffer()));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);

const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + dir.length;
pngs.forEach((png, i) => {
  const s = sizes[i];
  const o = i * 16;
  dir.writeUInt8(s === 256 ? 0 : s, o);      // width
  dir.writeUInt8(s === 256 ? 0 : s, o + 1);  // height
  dir.writeUInt8(0, o + 2);                  // palette
  dir.writeUInt8(0, o + 3);                  // reserved
  dir.writeUInt16LE(1, o + 4);               // planes
  dir.writeUInt16LE(32, o + 6);              // bpp
  dir.writeUInt32LE(png.length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += png.length;
});

writeFileSync('public/favicon.ico', Buffer.concat([header, dir, ...pngs]));
console.log('wrote public/favicon.ico', offset, 'bytes');
