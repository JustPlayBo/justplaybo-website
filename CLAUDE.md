# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` (or `ng serve`) — dev server on http://localhost:4200/, live reload.
- `npm run build` — production bundle into `dist/justplaybo-website-new`. Pass `--prod` / `--configuration=production` for the production config (applies `environment.prod.ts` replacement, budgets: 2mb warn / 5mb error initial, 6kb / 10kb per component style).
- `npm test` — Karma/Jasmine unit tests. To run a single spec, use `ng test --include=src/app/<path>/<file>.component.spec.ts` or temporarily narrow with `fdescribe` / `fit`.
- `npm run lint` — tslint across `tsconfig.app.json`, `tsconfig.spec.json`, and `e2e/tsconfig.json`.
- `npm run e2e` — Protractor end-to-end tests (boots `ng serve` automatically).

This is Angular CLI 9 / Angular 9 on TypeScript 3.7 — pinned versions, do not upgrade casually. Node 12 typings are used. Install with `npm install --legacy-peer-deps` if modern npm rejects the peer graph (see `eresolve-report.txt`).

Deployment is a two-step container build: `ng build --prod` produces `dist/`, then the `Dockerfile` (nginx:alpine) copies it to `/usr/share/nginx/html`. `nginx.conf` SPA-falls back to `index.html`. `src/_redirects` serves the same purpose on Netlify-style hosts and also routes `/.well-known/*` to `assets/well-known/`.

## Architecture

Single-module Angular SPA for the Just Play Bologna board-game association (Italian-language site). All feature components are declared in `src/app/app.module.ts` — there is no lazy loading or feature-module split.

**Routing** (`src/app/app-routing.module.ts`): flat route table. `/` redirects to `/home`. Legacy `/sustain` and `/sustainAd` paths redirect to `/support` and `/supportAd` — keep both when renaming. `list` is dual-registered (`list/:list` and `list`) so the same component handles filtered and unfiltered views via the `:list` param (`A`, `B`, or absent).

**Data flow** — the game catalog is fetched as CSV from a published Google Sheet via PapaParse, which is loaded globally from a CDN in `src/index.html` and referenced with `declare const Papa: any` (it is not an npm dependency):

- `ListService` (`src/app/list.service.ts`) calls `Papa.parse(listUrl, { download: true, header: true })` in its constructor and emits a `loaded` EventEmitter when rows arrive. The `listUrl` points to a specific published sheet; changing the sheet means changing this URL.
- `ListService` is provided at the **component level** (`providers: [ListService]` inside `ListComponent`), not in the module. Each navigation to `/list` re-fetches.
- Row filtering (`isRowVisible`) compares `game.list.$t` — a legacy shape from the previous Google Sheets JSON feed. New rows from the CSV feed may not have this shape; handle both.

**Angular Material + icons**: the app uses `@angular/material` (indigo-pink prebuilt theme, wired in `angular.json` styles). `AppModule`'s constructor registers the Material Design Icons sprite from `assets/mdi.svg` via `MatIconRegistry.addSvgIconSet` — icons are referenced by name, not imported individually.

**Responsive layout**: `AppComponent` uses `BreakpointObserver` against `(max-width: 599px)` and exposes `isSmallScreen` to the template. Components use a mix of `.scss` and `.less` stylesheets; both are allowed and already wired through Angular CLI's defaults.

**Analytics**: Google Analytics (UA-129007891-1) is hard-coded in `src/index.html`.

## Conventions

- Component selector prefix: `app` (enforced via `angular.json` and `tslint.json`).
- Component scaffolding defaults to SCSS (`angular.json` schematics), but existing components mix `.less` and `.scss` — match the surrounding component when editing.
- Route paths in Italian content reflect user-facing terminology (`support`/`supportAd`/`faq`); do not translate.
- `CatanComponent` is declared in the module but its route is commented out in `app-routing.module.ts` — it is intentionally dormant, not dead code.
