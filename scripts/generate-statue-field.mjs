#!/usr/bin/env node
/**
 * One-off asset generator (not part of the build/dev pipeline).
 *
 * Converts a source photograph of a classical statue into a compact
 * luminance+edge "ASCII field" baked into src/data/statueField.ts. The
 * source photo itself is never shipped — only the derived digit string is.
 *
 * Usage: node scripts/generate-statue-field.mjs <path-to-source-image>
 *
 * Source used for the committed asset: a CC-BY 3.0 photograph of
 * Michelangelo's David (Galleria dell'Accademia, Florence) by Jörg Bittner
 * Unna, Wikimedia Commons — cropped to head/shoulders/upper chest only.
 * https://commons.wikimedia.org/wiki/File:'David'_by_Michelangelo_JBU05.JPG
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Usage: node scripts/generate-statue-field.mjs <source-image>");
  process.exit(1);
}

// crop rect on the 2215x3323 source photo: head, shoulders, upper chest only.
const CROP = { left: 640, top: 0, width: 1020, height: 1220 };

const COLS = 122;
const ROWS = 130;
const RAMP = " .:-=+*#%@";

const EDGE_WEIGHT = 0.3;
const TONE_WEIGHT = 0.85;

// Subject mask: the background isn't a plain dark backdrop (it's a lit
// gallery wall with architectural panel moulding, similar tone to the
// marble), so a brightness-based vignette can't cleanly separate statue
// from wall — it either leaves a halo or eats real silhouette detail. Instead
// we derive an actual silhouette mask from local texture: the carved marble
// has continuous micro-contrast (chiaroscuro from tool marks, hair, muscle
// definition) while the wall is flat except for thin panel-line edges. A
// windowed variance map, opened (eroded+dilated) to strip those thin lines,
// then flood-filled as background from the crop's edges, isolates the
// subject. Only the top/left/right edges are used as flood seeds — the crop
// is tight enough that the *bottom* edge cuts through the torso/drapery
// itself, not background.
const MASK_SCALE = 4; // working-resolution multiple of the final grid
const VAR_RADIUS = 4; // half-width of the local variance window, in working px
const VAR_THRESHOLD = 30; // variance above this reads as "textured" (subject)
const OPEN_RADIUS = 3; // erode+dilate radius that strips thin panel-line edges

function integralImages(values, w, h) {
  const sum = new Float64Array((w + 1) * (h + 1));
  const sumSq = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    let rowSumSq = 0;
    for (let x = 0; x < w; x++) {
      const v = values[y * w + x];
      rowSum += v;
      rowSumSq += v * v;
      const idx = (y + 1) * (w + 1) + (x + 1);
      sum[idx] = sum[idx - (w + 1)] + rowSum;
      sumSq[idx] = sumSq[idx - (w + 1)] + rowSumSq;
    }
  }
  return { sum, sumSq };
}

function boxVariance(grey, w, h, radius) {
  const { sum, sumSq } = integralImages(grey, w, h);
  const out = new Float32Array(w * h);
  const W1 = w + 1;
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(h - 1, y + radius);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(w - 1, x + radius);
      const area = (y1 - y0 + 1) * (x1 - x0 + 1);
      const s =
        sum[(y1 + 1) * W1 + (x1 + 1)] -
        sum[y0 * W1 + (x1 + 1)] -
        sum[(y1 + 1) * W1 + x0] +
        sum[y0 * W1 + x0];
      const sq =
        sumSq[(y1 + 1) * W1 + (x1 + 1)] -
        sumSq[y0 * W1 + (x1 + 1)] -
        sumSq[(y1 + 1) * W1 + x0] +
        sumSq[y0 * W1 + x0];
      const mean = s / area;
      out[y * w + x] = Math.max(0, sq / area - mean * mean);
    }
  }
  return out;
}

// binary min/max filter (erode/dilate) over a square window, via integral image
function morphBinary(binary, w, h, radius, mode) {
  const { sum } = integralImages(binary, w, h);
  const out = new Uint8Array(w * h);
  const W1 = w + 1;
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(h - 1, y + radius);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(w - 1, x + radius);
      const area = (y1 - y0 + 1) * (x1 - x0 + 1);
      const s =
        sum[(y1 + 1) * W1 + (x1 + 1)] -
        sum[y0 * W1 + (x1 + 1)] -
        sum[(y1 + 1) * W1 + x0] +
        sum[y0 * W1 + x0];
      out[y * w + x] = mode === "dilate" ? (s > 0 ? 1 : 0) : s === area ? 1 : 0;
    }
  }
  return out;
}

// flood-fill "background" through non-textured cells, seeded only from the
// top/left/right edges (see comment above on why not the bottom edge)
function floodBackground(textured, w, h) {
  const reached = new Uint8Array(w * h);
  const queue = [];
  const idx = (r, c) => r * w + c;
  const trySeed = (r, c) => {
    const i = idx(r, c);
    if (textured[i] === 0 && !reached[i]) {
      reached[i] = 1;
      queue.push(i);
    }
  };
  for (let c = 0; c < w; c++) trySeed(0, c);
  for (let r = 0; r < h; r++) {
    trySeed(r, 0);
    trySeed(r, w - 1);
  }
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi];
    const r = Math.floor(i / w);
    const c = i % w;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;
      const ni = idx(nr, nc);
      if (reached[ni] || textured[ni] !== 0) continue;
      reached[ni] = 1;
      queue.push(ni);
    }
  }
  return reached;
}

// largest 4-connected component of a binary mask (by pixel count)
function largestComponent(mask, w, h) {
  const label = new Int32Array(w * h).fill(-1);
  let bestLabel = -1;
  let bestSize = 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = new Int32Array(w * h);
  let cur = 0;
  for (let start = 0; start < w * h; start++) {
    if (mask[start] !== 1 || label[start] !== -1) continue;
    let qh = 0;
    let qt = 0;
    queue[qt++] = start;
    label[start] = cur;
    let size = 0;
    while (qh < qt) {
      const i = queue[qh++];
      size++;
      const r = Math.floor(i / w);
      const c = i % w;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;
        const ni = nr * w + nc;
        if (mask[ni] === 1 && label[ni] === -1) {
          label[ni] = cur;
          queue[qt++] = ni;
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      bestLabel = cur;
    }
    cur++;
  }
  const keep = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) keep[i] = label[i] === bestLabel ? 1 : 0;
  return keep;
}

async function main() {
  const cropped = sharp(SRC).extract(CROP);

  const tonalBuf = await cropped
    .clone()
    .greyscale()
    .resize(COLS, ROWS, { fit: "fill", kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const EDGE_SCALE = 3;
  const ew = COLS * EDGE_SCALE;
  const eh = ROWS * EDGE_SCALE;
  const workingGrey = sharp(SRC)
    .extract(CROP)
    .greyscale()
    .resize(ew, eh, { fit: "fill", kernel: "lanczos3" });

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  const gxBuf = await workingGrey
    .clone()
    .convolve({ width: 3, height: 3, kernel: sobelX })
    .raw()
    .toBuffer();
  const gyBuf = await workingGrey
    .clone()
    .convolve({ width: 3, height: 3, kernel: sobelY })
    .raw()
    .toBuffer();

  const edgeMagFull = new Float32Array(ew * eh);
  let maxMag = 1;
  for (let i = 0; i < ew * eh; i++) {
    const gx = gxBuf[i] - 128;
    const gy = gyBuf[i] - 128;
    const m = Math.sqrt(gx * gx + gy * gy);
    edgeMagFull[i] = m;
    if (m > maxMag) maxMag = m;
  }

  const edgeGrid = new Float32Array(COLS * ROWS);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let sum = 0;
      let n = 0;
      for (let dy = 0; dy < EDGE_SCALE; dy++) {
        for (let dx = 0; dx < EDGE_SCALE; dx++) {
          const ex = col * EDGE_SCALE + dx;
          const ey = row * EDGE_SCALE + dy;
          sum += edgeMagFull[ey * ew + ex];
          n++;
        }
      }
      edgeGrid[row * COLS + col] = sum / n / maxMag;
    }
  }

  // subject mask — see comment on the MASK_* constants above
  const mw = COLS * MASK_SCALE;
  const mh = ROWS * MASK_SCALE;
  const maskGrey = await cropped
    .clone()
    .greyscale()
    .resize(mw, mh, { fit: "fill", kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const variance = boxVariance(maskGrey, mw, mh, VAR_RADIUS);
  const textured = new Uint8Array(mw * mh);
  for (let i = 0; i < variance.length; i++) {
    textured[i] = variance[i] > VAR_THRESHOLD ? 1 : 0;
  }

  // A curved gallery-wall corner (real architectural relief, so it has its
  // own genuine local contrast — opening alone can't strip it) passes
  // behind the statue at shoulder height and briefly touches the
  // silhouette on both the left (near the neck) and right (past the arm),
  // fusing into the same connected blob before the flood-fill/largest-
  // component step below ever runs. Photo-specific, hand-measured cuts:
  // sever both bridges at points confirmed (by rendering the working-
  // resolution texture mask) to be clear of any real statue detail.
  const cutBand = (colMin, colMax, rowOf, halfThickness) => {
    for (let c = colMin; c <= colMax; c++) {
      const rc = rowOf(c);
      for (let r = Math.max(0, Math.round(rc - halfThickness)); r <= Math.min(mh - 1, Math.round(rc + halfThickness)); r++) {
        textured[r * mw + c] = 0;
      }
    }
  };
  cutBand(0, 100, (c) => 218 + 0.2656 * c, 20); // left bridge, near the neck
  cutBand(395, mw - 1, () => 278, 22); // right bridge, past the arm

  const opened = morphBinary(morphBinary(textured, mw, mh, OPEN_RADIUS, "erode"), mw, mh, OPEN_RADIUS, "dilate");
  const floodReached = floodBackground(opened, mw, mh);
  // border flood-fill alone leaves disconnected textured islands standing
  // (real embossed wall moulding has its own genuine local contrast, so
  // opening can't strip it like it strips thin flat edges) — of what the
  // flood didn't reach, keep only the largest connected blob (the statue)
  // and treat every other island as background too
  const notBg = new Uint8Array(mw * mh);
  for (let i = 0; i < notBg.length; i++) notBg[i] = floodReached[i] ? 0 : 1;
  const keep = largestComponent(notBg, mw, mh);
  const bgReached = new Uint8Array(mw * mh);
  for (let i = 0; i < bgReached.length; i++) bgReached[i] = keep[i] ? 0 : 1;

  const maskAlpha = new Float32Array(COLS * ROWS);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let bgCount = 0;
      for (let dy = 0; dy < MASK_SCALE; dy++) {
        for (let dx = 0; dx < MASK_SCALE; dx++) {
          const mx = col * MASK_SCALE + dx;
          const my = row * MASK_SCALE + dy;
          bgCount += bgReached[my * mw + mx];
        }
      }
      maskAlpha[row * COLS + col] = 1 - bgCount / (MASK_SCALE * MASK_SCALE);
    }
  }

  const levels = new Uint8Array(COLS * ROWS);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const tonal = Math.pow(tonalBuf[idx] / 255, 1.5);
      const edge = edgeGrid[idx];

      const raw = Math.min(1, tonal * TONE_WEIGHT + edge * EDGE_WEIGHT);
      const final = Math.max(0, Math.min(1, raw * maskAlpha[idx]));
      levels[idx] = Math.round(final * (RAMP.length - 1));
    }
  }

  // final cleanup at grid resolution: the working-resolution mask above
  // still lets the odd small island of low-level noise through (a bridge
  // that reads as connected at working res can land as an isolated speck
  // once box-averaged down to the coarse grid) — drop everything except the
  // single largest connected blob of non-zero cells, which is the statue.
  const nonZero = new Uint8Array(COLS * ROWS);
  for (let i = 0; i < levels.length; i++) nonZero[i] = levels[i] > 0 ? 1 : 0;
  const keepFinal = largestComponent(nonZero, COLS, ROWS);

  let digits = "";
  for (let i = 0; i < levels.length; i++) {
    digits += String(keepFinal[i] ? levels[i] : 0);
  }

  const out = `// Generated by scripts/generate-statue-field.mjs — do not edit by hand.
// Source: CC-BY 3.0 photograph of Michelangelo's David (Galleria
// dell'Accademia, Florence) by Joerg Bittner Unna, Wikimedia Commons,
// cropped to head/shoulders/upper chest. Only this derived per-cell
// brightness field is shipped — the source photo itself is not bundled.
export const STATUE_FIELD = {
  cols: ${COLS},
  rows: ${ROWS},
  ramp: ${JSON.stringify(RAMP)},
  data: "${digits}",
} as const;
`;

  const outPath = path.resolve(import.meta.dirname, "../src/data/statueField.ts");
  await writeFile(outPath, out, "utf-8");
  console.log(`Wrote ${outPath} (${COLS}x${ROWS} = ${digits.length} cells)`);
}

main();
