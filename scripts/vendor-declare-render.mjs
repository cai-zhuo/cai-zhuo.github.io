#!/usr/bin/env node
/**
 * vendor-declare-render.mjs
 *
 * Copies the locally-built declare-render dist/ files into vendor/declare-render/
 * with two patches that make them work as native browser ES modules:
 *
 *   1. Adds the missing `.js` extensions to relative imports (TS strips them).
 *   2. Replaces `from "lodash-es"` with the esm.sh CDN URL.
 *
 * Skips Node-only files (node.js, engine/node-engine.js, engine/index.js,
 * engine/types.js) — the published exports map points the package's "main"
 * at node.js which esm.sh's CDN follows, breaking browser usage. Vendoring
 * the dist directly bypasses that.
 *
 * Run from the project root:
 *   node scripts/vendor-declare-render.mjs
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Config ----------------------------------------------------------------
const SOURCE_DIR =
  "/Users/caizhuo/Workspace/materials-editor/declare-renderer/dist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const TARGET_DIR = resolve(PROJECT_ROOT, "vendor", "declare-render");

const LODASH_CDN = "https://esm.sh/lodash-es@4.17.21";

// Skip these (Node-specific or transitively pull in `canvas`).
const SKIP = new Set([
  "node.js",
  "engine/index.js", // re-exports node-engine
  "engine/node-engine.js",
  "engine/types.js", // unused at runtime
]);

// --- Helpers ---------------------------------------------------------------
function fail(msg) {
  console.error(`\n✗ vendor-declare-render: ${msg}\n`);
  process.exit(1);
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full, base));
    } else if (entry.endsWith(".js")) {
      out.push(relative(base, full));
    }
  }
  return out;
}

function patchImports(content) {
  // 1. lodash-es -> CDN
  content = content.replace(
    /from\s*(["'])lodash-es\1/g,
    `from "${LODASH_CDN}"`
  );
  // 2. relative imports without .js extension -> add .js
  content = content.replace(
    /from\s*(["'])(\.\.?\/[^"']+?)\1/g,
    (match, quote, path) => {
      if (path.endsWith(".js") || path.endsWith(".mjs")) return match;
      return `from ${quote}${path}.js${quote}`;
    }
  );
  return content;
}

// --- Run -------------------------------------------------------------------
if (!existsSync(SOURCE_DIR)) {
  fail(
    `source dir not found: ${SOURCE_DIR}\n  → if materials-editor has moved, edit SOURCE_DIR at the top of this script`
  );
}

const files = walk(SOURCE_DIR);
let copied = 0;
let skipped = 0;

for (const rel of files) {
  if (SKIP.has(rel)) {
    skipped++;
    continue;
  }
  const src = join(SOURCE_DIR, rel);
  const dest = join(TARGET_DIR, rel);
  const destDir = dirname(dest);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  let content = readFileSync(src, "utf-8");
  content = patchImports(content);
  writeFileSync(dest, content, "utf-8");
  copied++;
}

console.log(`✓ vendored ${copied} files into ${relative(PROJECT_ROOT, TARGET_DIR)}/`);
console.log(`  skipped ${skipped} Node-only files`);
console.log(`  entry: vendor/declare-render/browser.js`);
