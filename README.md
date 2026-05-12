# SimpleWMS — Warehouse Management System

A small-but-complete warehouse management system originally built as my undergraduate thesis and modernized into a portfolio piece. It covers the full inbound → storage → outbound flow for a fictional distribution center: receiving handling units, assigning them to locations with a GRASP heuristic, taking sales orders from a CSV, reserving stock, generating transport orders, and dispatching.

| | |
|---|---|
| **Live demo** | _Add your Vercel URL here once deployed_ |
| **Backend repo** | https://github.com/paulcanasa99/simple-wms-backend |
| **Stack** | React 19 · TypeScript · Vite · MUI v6 · TanStack Query · React Router v6 · MSW · i18next |

The deployed demo runs entirely in the browser — there is no backend dependency. A Mock Service Worker intercepts every API call and serves seeded data persisted in `localStorage`, so reviewers can click around without setup.

---

## What it does

- **Warehouse map** — visualizes a 16-rack warehouse with live occupancy per shelf and a status panel.
- **Inventory** — list of every handling unit, with filters and a GRASP-based location-assignment action.
- **Products** — catalogue with ABC-rotation classification, plus per-product summary and Kardex (movement history) reports.
- **Sales orders** — CSV import, status filtering, per-line stock check before reserving units for dispatch.
- **Inbound / outbound / transport orders** — full operational lifecycle: an inbound CSV creates handling units → GRASP assigns each to a free location and emits a transport order → sales orders reserve units → dispatch generates outbound transport orders.
- **EN / ES** — every label is translated; the language switcher lives in the navbar and the locale flows through to MUI X DataGrid + DatePicker.

---

## Architecture

```
┌───────────────────────────┐         ┌───────────────────────────┐
│  Pages (13 routes)        │         │  React Router v6          │
│  • Almacén / Estantería   │ ───────▶│  Protected routes guard   │
│  • Inventario             │         └───────────────────────────┘
│  • Productos / Kardex     │                    │
│  • Pedidos                │                    ▼
│  • Ingreso / Despacho /   │         ┌───────────────────────────┐
│    Transporte             │ ───────▶│  TanStack Query hooks     │
└───────────────────────────┘         │  (refetchInterval polling)│
                                      └─────────────┬─────────────┘
                                                    │
                                  ┌─────────────────▼─────────────────┐
                                  │  axios client (Authorization, …)  │
                                  └─────────────────┬─────────────────┘
                                                    │
                       ┌────────────────────────────┴───────────────────────────┐
                       ▼                                                        ▼
            ┌──────────────────────┐                              ┌──────────────────────┐
            │  Real backend        │                              │  MSW (browser)       │
            │  (Express + Mongo)   │   ── on health-check fail ──▶│  Seeded localStorage │
            └──────────────────────┘                              └──────────────────────┘
```

### Hybrid demo mode

On boot the app pings the API. If `VITE_API_URL` is unset, the health check fails, or `VITE_DEMO_MODE=true`, MSW takes over and a banner explains we're in demo mode. Otherwise requests go to the real backend untouched. The same code paths drive both — only the network boundary differs.

### Folder layout

```
src/
  api/             # axios client + one module per resource
  hooks/           # TanStack Query hooks (one per resource)
  auth/            # AuthContext + token storage
  mocks/           # MSW handlers, seed data, in-memory DB
  i18n/            # i18next setup + ES + EN bundles
  components/      # Layout, Navbar, DataGrid wrapper, snackbar, …
  pages/           # 13 route components
  types/api.ts     # TS types for every domain entity
  utils/format.ts  # date-fns helpers
```

---

## Getting started

```bash
# 1. install
npm install

# 2. run in demo mode (no backend required — MSW serves mock data)
npm run dev

# 3. or point at a real backend
echo 'VITE_API_URL=http://localhost:3001' > .env.local
npm run dev
```

Other scripts:

| Command          | What it does                                         |
| ---------------- | ---------------------------------------------------- |
| `npm run dev`    | Vite dev server on `http://localhost:3000`           |
| `npm run build`  | Type-check (`tsc -b`) + production build to `dist/`  |
| `npm run preview`| Serve the production build locally                   |
| `npm test`       | Run Vitest suite (API layer + seed sanity)           |
| `npm run lint`   | ESLint over `src/`                                   |
| `npm run format` | Prettier over the repo                               |

When MSW is active for the first time it writes a service worker to `public/mockServiceWorker.js`. Don't edit it — re-run `npx msw init public/ --save` if it ever needs regenerating.

---

## Modernization notes

This project started life on Create React App in 2021. The original stack — React 17, `@reach/router`, MUI v5 (early), Moment, plain JavaScript, polling via `setInterval`, default CRA README — has been replaced with:

| Was                                | Now                                              |
| ---------------------------------- | ------------------------------------------------ |
| Create React App                   | Vite 6                                           |
| React 17                           | React 19                                         |
| `@reach/router` (deprecated)       | React Router v6                                  |
| MUI v5 + `@mui/lab` DatePicker     | MUI v6 + `@mui/x-date-pickers` v7                |
| `@mui/x-data-grid` v5 beta         | `@mui/x-data-grid` v7 (new pagination/selection) |
| Plain JS                           | TypeScript (strict)                              |
| Moment.js                          | date-fns v4 (with `es` / `enUS` locales)         |
| Manual `setInterval` polling       | TanStack Query `refetchInterval`                 |
| No tests                           | Vitest + MSW                                     |
| No lint config beyond CRA defaults | ESLint flat config + Prettier                    |
| Spanish only                       | i18next with EN + ES                             |
| Live Heroku backend (now dead)     | MSW-mocked demo, optional real backend           |

The data model and screen flows are unchanged — the goal was to keep the original thesis features intact while making the project something a recruiter (or my future self) can actually run.

---

## Original thesis context

Built for a logistics / industrial-engineering capstone: the project explores how a small distribution center could organize its operations using a software-driven warehouse map, the GRASP heuristic for location assignment, and a Kardex ledger for stock auditing. The terminology stays close to the Spanish original (Almacén, Inventario, Pedidos, …) — toggle the language switcher to read it in English instead.
