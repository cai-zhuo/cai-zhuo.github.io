# What I've Built Recently

A bilingual (EN / 中) static portfolio site showing my recent projects, deployed at [cai-zhuo.github.io](https://cai-zhuo.github.io/).

Plain HTML / CSS / JS — no build step, no dependencies.

## Local preview

Open `index.html` directly in a browser, or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Update RPG World progress

The RPG World progress panel is fed by a snapshot of [`rpg-world/tasks.json`](../rpg-world/tasks.json). To refresh it:

```bash
node scripts/sync-progress.mjs
git add data/rpg-tasks.js
git commit -m "chore: sync rpg-world progress"
git push
```

The sync script reads from the absolute path `/Users/caizhuo/Workspace/rpg-world/tasks.json`. If the rpg-world repo moves, edit the `SOURCE` constant at the top of `scripts/sync-progress.mjs`.

## Refresh the vendored declare-render

The live demos in the Materials AI section use `declare-render` loaded as a native ES module from `vendor/declare-render/`. This is a patched copy of the locally-built dist (esm.sh's CDN can't serve it correctly because the published package's `exports` field routes through `node.js` → the Node `canvas` native binding, which can't run in browsers).

To refresh after `declare-render` is rebuilt in the materials-editor monorepo:

```bash
node scripts/vendor-declare-render.mjs
git add vendor/declare-render
git commit -m "chore: refresh vendored declare-render"
```

The script reads from `/Users/caizhuo/Workspace/materials-editor/declare-renderer/dist/`, skips Node-only files, and patches relative imports (adds `.js` extensions) and the `lodash-es` import (rewrites to esm.sh CDN). Edit `SOURCE_DIR` at the top of `scripts/vendor-declare-render.mjs` if materials-editor moves.

## Add screenshots

1. Drop image files into `assets/materials-ai/` or `assets/rpg-world/`
2. Open `index.html` and find the placeholder block (search for `data-placeholder`)
3. Replace the placeholder markup with `<img src="assets/.../shot-01.png" alt="...">`

## Add a good case (Materials AI)

1. Drop the rendered poster image into `assets/materials-ai/`
2. In `index.html`, find the "Good Cases" grid and replace one of the placeholder cards with a real `<figure>`

## Deploy

This site lives in the `cai-zhuo/cai-zhuo.github.io` GitHub repo. Deployment is automatic on push to `main`:

1. One-time: create the repo on GitHub named exactly `cai-zhuo.github.io`
2. From this directory:
   ```bash
   git remote add origin https://github.com/cai-zhuo/cai-zhuo.github.io.git
   git push -u origin main
   ```
3. On github.com → repo → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
4. Wait ~30-60 seconds. Visit https://cai-zhuo.github.io/

Future pushes to `main` auto-publish.

## File map

```
.
├── index.html              # the only page
├── styles.css              # design tokens + all styles
├── script.js               # language toggle + RPG progress renderer
├── data/
│   └── rpg-tasks.js        # auto-generated snapshot
├── scripts/
│   └── sync-progress.mjs   # refresh rpg-tasks.js from rpg-world repo
├── assets/
│   ├── favicon.svg
│   ├── materials-ai/       # drop Materials AI screenshots here
│   └── rpg-world/          # drop RPG World screenshots / GIFs here
└── .nojekyll               # tells GitHub Pages to skip Jekyll
```
