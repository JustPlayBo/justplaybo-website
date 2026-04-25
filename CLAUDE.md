# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` (or `ng serve`) — dev server on http://localhost:4200/, live reload.
- `npm run build` — production bundle into `dist/justplaybo-website-new`. Pass `--configuration=production` explicitly for the production config (applies `environment.prod.ts` replacement, budgets: 2mb warn / 5mb error initial, 6kb / 10kb per component style).
- `npm test` — Karma/Jasmine unit tests. To run a single spec, use `ng test --include=src/app/<path>/<file>.component.spec.ts` or temporarily narrow with `fdescribe` / `fit`.

No lint target exists. There are no e2e tests (Protractor was dropped during the v11 → v12 upgrade and no replacement was added).

This is **Angular 21** on TypeScript 5.9 and zone.js 0.15. Node 20.19+ or 22.12+ is required — the host OS may still have an older Node; run everything through Docker:

```bash
docker run --rm -v $(pwd):/app -w /app node:22-alpine sh -c "npm install --legacy-peer-deps && node_modules/.bin/ng build --configuration=production"
```

Use `--legacy-peer-deps` on install — `@mdi/angular-material@5` pins an ancient peer and is unused at runtime (icons are served from `assets/mdi.svg`), but it stays in deps and breaks strict peer resolution.

Deployment is a two-step container build: `ng build --configuration=production` produces `dist/`, then the `Dockerfile` (nginx:alpine) copies it to `/usr/share/nginx/html`. `nginx.conf` SPA-falls back to `index.html`. `src/_redirects` serves the same purpose on Netlify-style hosts and also routes `/.well-known/*` to `assets/well-known/`.

## Architecture

Single-module Angular SPA for the Just Play Bologna board-game association (Italian-language site). All feature components are declared in `src/app/app.module.ts` with `standalone: false` — there is no lazy loading or feature-module split. Angular 21 defaults new components to standalone, so any new component must opt in explicitly (`standalone: false`) or migrate the whole app to standalone.

**Routing** (`src/app/app-routing.module.ts`): flat route table. `/` redirects to `/home`. Legacy `/sustain` and `/sustainAd` paths redirect to `/support` and `/supportAd` — keep both when renaming. `list` is dual-registered (`list/:list` and `list`) so the same component handles filtered and unfiltered views via the `:list` param (`A`, `B`, or absent).

**Data flow** — the game catalog is fetched as CSV from a published Google Sheet via PapaParse, which is loaded globally from a CDN in `src/index.html` and referenced with `declare const Papa: any` (it is not an npm dependency):

- `ListService` (`src/app/list.service.ts`) calls `Papa.parse(listUrl, { download: true, header: true })` in its constructor and emits a `loaded` EventEmitter when rows arrive. The `listUrl` points to a specific published sheet; changing the sheet means changing this URL.
- `ListService` is provided at the **component level** (`providers: [ListService]` inside `ListComponent`), not in the module. Each navigation to `/list` re-fetches.
- Row filtering (`isRowVisible`) compares `game.list.$t` — a legacy shape from an earlier Google Sheets JSON feed. New rows from the CSV feed may not have this shape; handle both.

**HttpClient** is wired through `provideHttpClient(withInterceptorsFromDi())` in `AppModule.providers` (v18 migration replaced `HttpClientModule`).

**Angular Material theming** (`src/styles.scss`): uses the modern `@use '@angular/material' as mat;` API with custom M2 palettes (primary `#9b2324`, accent `#c4b9b9`, warn `#f78888`). `mat.m2-*` mixins are still the M2-compatibility path in v21 — if you move to M3, rewrite the whole file. The MDC migration at v17 already removed the `MatLegacy*` imports; components use the current `@angular/material/button`, `/table`, `/card`, etc.

**Icons**: `AppModule`'s constructor registers the Material Design Icons sprite from `assets/mdi.svg` via `MatIconRegistry.addSvgIconSet` — icons are referenced by name, not imported individually. The `@mdi/angular-material` npm dependency is unused.

**Responsive layout**: `AppComponent` uses `BreakpointObserver` against `(max-width: 599px)` and exposes `isSmallScreen` to the template. Components use a mix of `.scss` and `.less` stylesheets; both are allowed and already wired through Angular CLI's defaults.

**Analytics**: Google Analytics (UA-129007891-1, legacy Universal Analytics) is hard-coded in `src/index.html` — UA has been deprecated by Google, so this is effectively dead telemetry.

## Conventions

- Component selector prefix: `app` (enforced via `angular.json`).
- Component scaffolding defaults to SCSS (`angular.json` schematics), but existing components mix `.less` and `.scss` — match the surrounding component when editing.
- Route paths in Italian content reflect user-facing terminology (`support`/`supportAd`/`faq`); do not translate.
- `CatanComponent` is declared in the module but its route is commented out in `app-routing.module.ts` — it is intentionally dormant, not dead code.
- Templates still use `*ngIf` / `*ngFor`. Angular 21 supports both the old structural directives and the `@if` / `@for` control-flow blocks; prefer the new syntax for new templates.
- `src/app/app.component.html` has a known typo on the `*ngIf="!isSmallScreen"href="..."` lines (missing space between attributes) — the template renders anyway, but the `@if` migration tool cannot parse it until fixed.
