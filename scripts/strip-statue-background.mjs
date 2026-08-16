#!/usr/bin/env node
/**
 * One-off post-process (not part of the build/dev pipeline).
 *
 * generate-statue-field.mjs bakes an elliptical vignette into the field so
 * the background fades out, but the fade is gradual and leaves a faint
 * oval halo of low-level cells around the actual silhouette. This strips
 * that halo: flood-fills from the grid's border through any cell at or
 * below BG_THRESHOLD, then zeroes every cell that fill reached. Cells only
 * reachable by crossing a brighter cell (i.e. anything enclosed by the
 * statue's own silhouette, like a shadow under the chin) survive untouched.
 *
 * Usage: node scripts/strip-statue-background.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FIELD_PATH = path.resolve(import.meta.dirname, "../src/data/statueField.ts");
const BG_THRESHOLD = 2;

async function main() {
  const src = await readFile(FIELD_PATH, "utf-8");
  const colsMatch = src.match(/cols:\s*(\d+)/);
  const rowsMatch = src.match(/rows:\s*(\d+)/);
  const dataMatch = src.match(/data:\s*"(\d+)"/);
  if (!colsMatch || !rowsMatch || !dataMatch) {
    throw new Error("couldn't parse cols/rows/data out of statueField.ts");
  }
  const cols = Number(colsMatch[1]);
  const rows = Number(rowsMatch[1]);
  const data = dataMatch[1].split("").map(Number);

  const visited = new Uint8Array(cols * rows);
  const queue = [];
  const idx = (r, c) => r * cols + c;

  for (let c = 0; c < cols; c++) {
    for (const r of [0, rows - 1]) {
      const i = idx(r, c);
      if (data[i] <= BG_THRESHOLD && !visited[i]) {
        visited[i] = 1;
        queue.push(i);
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (const c of [0, cols - 1]) {
      const i = idx(r, c);
      if (data[i] <= BG_THRESHOLD && !visited[i]) {
        visited[i] = 1;
        queue.push(i);
      }
    }
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi];
    const r = Math.floor(i / cols);
    const c = i % cols;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const ni = idx(nr, nc);
      if (visited[ni]) continue;
      if (data[ni] <= BG_THRESHOLD) {
        visited[ni] = 1;
        queue.push(ni);
      }
    }
  }

  let removed = 0;
  for (let i = 0; i < data.length; i++) {
    if (visited[i]) {
      data[i] = 0;
      removed++;
    }
  }

  const newDigits = data.join("");
  const out = src.replace(/data:\s*"\d+"/, `data: "${newDigits}"`);
  await writeFile(FIELD_PATH, out, "utf-8");
  console.log(`Stripped ${removed} background cells of ${data.length} from ${FIELD_PATH}`);
}

main();
