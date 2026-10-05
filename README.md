# idkwhodatis — portfolio

A Vue 3 portfolio for software, games, and music, rebuilt with **shadcn-vue, Reka UI, Tailwind CSS 4, and Vite**. The redesign is developed on the `new` branch; `master` and the live Pages configuration are intentionally unchanged.

## Design

The visual direction comes from `KnowYourself/Doc`: near-black backgrounds, Geist typography, muted blue/sage/rose accents, spacious poster compositions, translucent line artwork, and flowing ribbons. `src/lib/waves.js` ports that project's ribbon geometry and spring motion into JavaScript; `AmbientWaves.vue` implements the Vue lifecycle. The artwork and copy are adapted to this portfolio, not a React wrapper.

The intro offers four scenes with manual selection and a pause control. Reduced-motion preferences disable movement and rotation. Hidden tabs and an off-screen intro stop rendering animation frames. Navigation uses normal scrolling rather than intercepting wheel/touch events.

## Development

Use Node.js **22.12 or newer**. npm and `package-lock.json` are the canonical dependency setup; the obsolete Quasar-era `bun.lockb` is removed. Bun can also run the package scripts, but do not maintain competing lockfiles.

```sh
npm ci
npm run dev
```

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

Actual shadcn-vue components live in `src/components/ui/`, with the CLI configuration in `components.json`. They are editable source files, not a second UI framework or a Quasar skin. To add another component:

```sh
npx shadcn-vue@latest add <component>
```

The initial CI run bootstraps Button, Card, Badge, Dialog, Tabs, Input, and Separator from the official registry, then commits the generated source and dependency lockfile with the verified build. After that, builds use the committed components and `npm ci`; they do not regenerate the component library.

## Project content

The existing **14 project records, media, categories, tags, dates, repository links, and music links** are retained. Add or edit content in `public/projects/`:

1. Create `<project name>.json` using an existing record as the schema.
2. Add the exact name to `public/projects/projects.json`.
3. Put image previews in `public/projects/preview/<project name>.<extension>`.

Dates use `M.D.YYYY`; categories are `software`, `game`, or `music`. Image previews use the extension (for example, `.png`); `none` gets a local artwork fallback. Music previews accept YouTube embed URLs. Embeds load only when a visitor opens a music preview and are removed when it closes.

Vite's small catalogue plugin validates and bundles these JSON records at build time, preserving the authoring format without a runtime request waterfall. JSON changes reload the development page. Filtering and search match names, descriptions, and tags. Missing screenshots have a graceful fallback.

## Build and GitHub Pages

**The output folder is `docs/` (plural), preserving the repository's existing build directory.** `vite.config.js` sets `build.outDir: 'docs'`, `emptyOutDir: true`, and relative asset paths. Each build replaces obsolete bundles, copies `public/`, and includes `.nojekyll`.

The workflow in `.github/workflows/portfolio.yml` installs dependencies, tests the catalogue and geometry, builds, runs desktop/mobile Playwright and axe accessibility checks, and only then commits `docs/` back to `new`. Build results and screenshots are also retained as Actions artifacts. It never force-pushes, changes `master`, or updates Pages settings. Concurrent source changes make a stale build's push fail rather than overwrite work.

Vue Router uses hash URLs (`/#/about`), so refreshing internal pages works on GitHub Pages without server rewrites. The static `404.html` also redirects the old `/about` URL. The previous React site remains linked from About.

To publish this branch later, select `new` and `/docs` in the repository's GitHub Pages branch settings, or merge the reviewed changes into the branch currently used by Pages. Merely creating `new` does not change the public website.

## Layout

- `src/components/HeroGallery.vue`, `AmbientWaves.vue`, `SceneArt.vue`: intro and artwork.
- `src/components/Project.vue`: responsive project cards and accessible media dialogs.
- `src/views/`: Home, About, and in-app 404.
- `src/assets/main.css`: design tokens, typography, responsive layouts, and motion preferences.
- `src/lib/projects.js`, `scripts/catalogue.js`: safe normalization and build-time catalogue.
- `tests/`: unit, browser, accessibility, and screenshot checks.

The original Google Analytics property is preserved and only enabled on the production hostname, not development or CI.
