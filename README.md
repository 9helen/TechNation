# TechNation

TechNation's Myanmar technology news and blog website.

## GitHub Pages

The reader-facing site is published at https://9helen.github.io/TechNation/. GitHub Actions builds it from `site-content/` into `pages-build/`.

The password-protected writer page and upload API remain on the existing TechNation backend at https://technation.hksh-yin.chatgpt.site/admin. The Pages build reads public posts from that backend. Never add backend passwords, session secrets, or storage credentials to this repository.

## Source layout

- `site-content/` — homepage, archive page, images, and fluid background script
- `worker/server.template.js` — server routes for the existing backend
- `scripts/build-worker.mjs` — generates the Worker and Pages outputs
- `.github/workflows/pages.yml` — builds and deploys GitHub Pages on pushes to `main`

Build locally with `node scripts/build-worker.mjs`. Pages files are generated in the ignored `pages-build/` directory.
