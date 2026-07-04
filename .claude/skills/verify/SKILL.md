---
name: verify
description: Build, launch, and drive the jazz-utilities app to verify changes end-to-end.
---

# Verifying jazz-utilities

Next.js static-export app, GUI surface only. Drive it with headless Chromium (Playwright).

## Launch

```bash
npm run dev   # ready in <1s on http://localhost:3000
```

**Gotcha:** `next.config.ts` sets `basePath: '/jazz-utilities'` (GitHub Pages), so the
app is at `http://localhost:3000/jazz-utilities` — plain `/` 404s.

## Drive

No Playwright in the repo (keep it that way — it's not a project dep). Install it in
the session scratchpad: `npm init -y && npm install playwright && npx playwright install chromium`.

Flows worth driving:
- Chord grid: 8 `<output>` elements in the first `div.grid`; guide-tone is a `<span>` inside each.
- Options `<details>`: `#noteNumberInput` (blur clamps to ≥1), note/chord checkboxes are
  `fieldset input[value="..."]` (the major chord's value is the empty string `""`),
  `#enableRandomSequenceInput` gates the sequence controls' `disabled`.
- Presets: Save/Load A–C buttons write/read `jazzPreset{A,B,C}` in localStorage;
  main options auto-save under key `formOptionsStorage` (Sets stored as arrays).
- Metronome `<details>`: `#tempoInput` blur-clamps to [60,300] (0→60, >300→300),
  `#measuresInput` clamps to [1,32] and is disabled while `#preventSwitchingCheckbox`
  is checked. Starting shows one beat dot (`.rounded-full`) per beat of the time
  signature; with Prevent Switching off, chords regenerate each cycle (audible +
  chord text changes).
- Corrupt `formOptionsStorage` + reload → defaults + console.error (expected, twice in
  dev due to StrictMode).
