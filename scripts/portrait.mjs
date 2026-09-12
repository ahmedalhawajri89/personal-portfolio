// Turns one source portrait into the sizes the site serves.
//
//   node scripts/portrait.mjs [source]        default: public/me.jpg
//
// Writes public/me/me-<w>.webp for every width in SIZES, plus a square avatar
// crop at 96 and 192. The manifest it prints is what <img srcset> wants.
//
// The source should be the camera original. Everything here is a reduction:
// a small file enlarged is invented detail, and it looks like invented detail,
// so the script refuses to upscale and tells you what it would have needed.

import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const SRC = process.argv[2] || 'public/me.jpg';
const OUT = 'public/me';

// Portrait in the About section, at 1x and 2x of its largest rendered width.
const SIZES = [320, 480, 640, 960];
// The hero greeting avatar and the same again for retina.
const AVATARS = [96, 192];

if (!existsSync(SRC)) {
  console.error(`no ${SRC}\nSave the full-resolution original there, then run this again.`);
  process.exit(1);
}

const src = sharp(SRC).rotate();            // honour the camera's EXIF orientation
const m = await src.metadata();
const need = Math.max(...SIZES);
console.log(`source: ${basename(SRC)}  ${m.width}×${m.height}  ${m.format}`);

if (m.width < need || m.height < need) {
  console.warn(
    `\n⚠  ${m.width}×${m.height} is under the ${need}px the largest portrait needs.\n` +
    `   Sizes above the source will be skipped rather than upscaled — an enlarged\n` +
    `   photo reads as soft and cheap, which is worse than a smaller sharp one.\n` +
    `   For the full set, export the original at ${need}px or more on the short side.\n`
  );
}

mkdirSync(OUT, { recursive: true });

// A light, honest grade. Nothing here invents detail: it lifts a flat exposure,
// opens the shadows a touch and puts back the micro-contrast that any resize
// takes away. Sharpening is applied after the resize, per size, because a
// radius that suits 960px smears 96px.
const graded = (pipe) => pipe.modulate({ brightness: 1.06, saturation: 1.04 }).linear(1.06, -8);

const out = [];
for (const w of SIZES) {
  if (w > m.width) { console.log(`  skip ${w}px — larger than the source`); continue; }
  const buf = await graded(sharp(SRC).rotate())
    .resize({ width: w, withoutEnlargement: true })
    .sharpen({ sigma: Math.max(0.5, w / 900) })
    .webp({ quality: 82, effort: 6 })
    .toBuffer();
  writeFileSync(join(OUT, `me-${w}.webp`), buf);
  out.push({ w, bytes: buf.length });
  console.log(`  me-${w}.webp   ${(buf.length / 1024).toFixed(1)} KB`);
}

// Square, centred on the upper third where a head sits in a standing portrait.
const side = Math.min(m.width, m.height);
for (const w of AVATARS) {
  const buf = await graded(sharp(SRC).rotate())
    .extract({
      left: Math.round((m.width - side) / 2),
      top: Math.round(Math.min((m.height - side) / 2, m.height * 0.06)),
      width: side, height: side,
    })
    .resize({ width: w, withoutEnlargement: true })
    .sharpen({ sigma: Math.max(0.5, w / 300) })
    .webp({ quality: 84, effort: 6 })
    .toBuffer();
  writeFileSync(join(OUT, `avatar-${w}.webp`), buf);
  console.log(`  avatar-${w}.webp  ${(buf.length / 1024).toFixed(1)} KB`);
}

console.log(`\nsrcset: ${out.map((o) => `/me/me-${o.w}.webp ${o.w}w`).join(', ')}`);
