# Dovetail Client Portal

React + Vite + TypeScript + Tailwind CSS rebuild of the Dovetail Client Portal dashboard.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Structure

- `src/pages/` — Home, Open Cases, Quotes, All Cases, Closed Cases
- `src/components/` — Header, sidebar, buttons, popups, badges, tables, layout
- `src/routes/` — React Router paths and route tree
- `src/apis/` — Mock API layer for cases, quotes, comments, and change requests
- `src/hooks/` — Modal, search, and keyboard helpers
- `src/data/` — Static portal mock data
- `src/libs/` — Centralized colors, fonts, utilities, and Excel export

Styling uses Tailwind utilities on components. Global colors, fonts, radii, and shadows live in `src/libs/theme.css` (wired into Tailwind via `@theme` in `src/index.css`). Repeated class fragments are in `src/libs/ui.ts`.

Optional: place `public/dovetail-blue-background.png` to restore the branded photo backdrop.
