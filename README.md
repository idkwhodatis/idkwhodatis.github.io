# idkwhodatis — portfolio

A Vue 3 portfolio for software, games, and music, rebuilt with **shadcn-vue, Reka UI, Tailwind CSS 4, and Vite**. The redesign is developed on `new`; `master` and the live Pages configuration are intentionally unchanged.

## Design

The visual direction comes from `KnowYourself/Doc`: near-black backgrounds, Geist typography, muted blue/sage/rose accents, spacious poster compositions, translucent line artwork, and flowing ribbons. `src/lib/waves.js` ports that project's ribbon geometry and spring motion into JavaScript; `AmbientWaves.vue` implements the Vue lifecycle. The artwork and copy are adapted to this portfolio, not a React wrapper.

The intro offers four scenes, manual selection, and a pause control. Reduced-motion preferences disable movement and rotation. Hidden tabs and an off-screen intro stop animation frames. Navigation uses normal scrolling rather than intercepting wheel/touch events.

## Development

Use Node.js **22.12 or newer**:

```sh
npm install
npm run dev
```

The first successful build workflow captures and commits `package-lock.json`; after that use `npm ci` for clean, reproducible installs. npm is the canonical lockfile format. Bun can also run the package scripts, but the obsolete Quasar-era `bun.lockb` has been removed; avoid competing lockfiles.

```sh
npm test          # catalogue validation, URLs, filtering, dates and wave geometry
npm run build    # production output goes directly to docs/
npm run preview
```

To run browser checks against the production build:

```sh
npx playwright install chromium
npm run test:e2e
```

## Components

The Button, Card, Badge, Dialog, Tabs, and Input components are **committed source** in `src/components/ui/`, adapted to JavaScript from shadcn-vue's New York registry. They retain the upstream styling model and Reka UI's interaction primitives, with local portfolio adjustments. See the included MIT license. There is no Quasar skin, React wrapper, or build-time component download.

`components.json` remains compatible with the shadcn-vue CLI. To add another component:

```sh
npx shadcn-vue@latest add <component>
```

## Project content

The original 14 project records, media, categories, tags, dates, project links, and music links are retained. Add or edit content in `public/projects/`:

1. Create `<project name>.json` using an existing record as the schema.
2. Add the exact name to `public/projects/projects.json`.
3. Put image previews in `public/projects/preview/<project name>.<extension>`.

Dates use `M.D.YYYY`; categories are `software`, `game`, or `music`. Image previews use an extension (for example, `.png`); `none` gets a local artwork fallback. Music previews accept YouTube embed URLs. Embeds load only when a visitor opens a music preview and are removed when it closes.

The Vite catalogue plugin validates and bundles these records, preserving their authoring format without a runtime request waterfall. JSON changes reload the development page. Filtering and search match names, descriptions, and tags. Missing screenshots have a graceful fallback. The catalogue unit tests follow the manifest, so adding projects does not require changing a hard-coded count.

## Build and GitHub Pages

**The output folder is `docs/` (plural), preserving the repository's existing build directory.** Vite sets `build.outDir: 'docs'`, `emptyOutDir: true`, and relative asset paths. Each successful build replaces obsolete bundles, copies `public/`, and includes `.nojekyll`.

The workflow in `.github/workflows/portfolio.yml` installs dependencies, tests the catalogue and geometry, builds, runs desktop/mobile Playwright and axe accessibility checks, and only then commits `docs/` back to `new`. Build results and screenshots are also retained as Actions artifacts. It never force-pushes, changes `master`, or updates Pages settings. Concurrent source changes cause a stale build's push to fail rather than overwrite work.

Vue Router uses hash URLs (`/#/about`), so refreshing internal pages works on GitHub Pages without server rewrites. The static `404.html` also redirects the old `/about` URL. The previous React site remains linked from About.

To publish later, select `new` and `/docs` in GitHub Pages settings, or merge the reviewed changes into the branch currently used by Pages. Creating `new` does not change the public website. A queued or failed Actions run does not update the committed `docs/` output: check that the build has succeeded before publishing.

## Layout

- `src/components/HeroGallery.vue`, `AmbientWaves.vue`, `SceneArt.vue`: intro and artwork.
- `src/components/Project.vue`: responsive project cards and accessible media dialogs.
- `src/components/ui/`: source-owned shadcn-vue components and upstream license.
- `src/views/`: Home, About, and in-app 404.
- `src/assets/main.css`: design tokens, typography, responsive layouts, and motion preferences.
- `src/lib/projects.js`, `scripts/catalogue.js`: normalization and build-time catalogue.
- `tests/`: unit, browser, accessibility, and screenshot checks.

The original Google Analytics property is preserved and only enabled on the production hostname, not development or CI.
