# Refactoring Plan

Goal: same app, same behavior, same UI — just less duplication and easier to read.
No new libraries, no new abstractions beyond what removes real repetition.

## 1. One `CheckboxGroup` component instead of three

`NoteCheckboxGroup`, `ChordCheckboxGroup`, and `SequenceCheckboxGroup` are the same
component copy-pasted three times: render a list of checkboxes, toggle membership in a
`Set<string>`. Merge into a single `CheckboxGroup` with props:

```ts
{ items, selected, onChange, className?, disabled? }
// items: Array<string | { value: string; display: string }>
```

Delete the three old files. `OptionsForm` passes the layout `className` it needs per group.

## 2. Single source of truth for `FormOptions`

The `FormOptions` interface is defined in `storageUtils.ts` **and** re-declared inline in
`OptionsForm.tsx`, and `chordUtils.ts` re-types its slices inline in function signatures.

- Keep the one definition in `_lib` and import it everywhere.
- `mainRandomGenerate` / `generateSequence` take `FormOptions` (or `Pick<FormOptions, ...>`).

## 3. Centralize localStorage (de)serialization

The "Set → Array before save / Array → Set after load" dance is written in 3 places:
the save-effect in `page.tsx`, `getInitialFormOptions`, and the preset save/load handlers
in `OptionsForm`. Replace with two helpers in `storageUtils.ts`:

```ts
saveFormOptions(key: string, options: FormOptions): void
loadFormOptions(key: string): FormOptions | null
```

Presets and the auto-save effect both use them. Also rename the file to `formOptions.ts`
since it owns the type + defaults + persistence.

## 4. Make `generateRandomTargetTone` data-driven

The 90-line switch is 14 cases of the same idea: "start from
`["1","9","3","#11","5","13","7"]`, substitute some degrees, pick one at random."
Replace with a lookup table of substitutions per chord quality:

```ts
const DEGREE_SUBSTITUTIONS: Record<string, Record<string, string | null>> = {
  "7":    { "#11": "4" },
  "m7":   { "3": "b3", "#11": "11" },
  "alt":  { "9": "b9", "5": null, "13": "b13", /* +"#9" */ },
  // ...
};
```

Apply substitutions, then one `pickRandom(...)` at the end. Same output, ~½ the lines,
and adding a chord quality becomes a one-line table entry.

**Two behavior fixes (approved — done in Order of work step 1):**
- **Bug** in `case "alt"`: `splice(indexOf("5"), 0)` deletes nothing (deleteCount is 0) —
  the intent was clearly to drop the natural 5 from an altered chord. Fix so the
  natural 5 is actually removed.
- `7#11` is selectable in the form but has no case, so it falls through to `default`
  and can produce a plain `7` guide tone over a `#11` chord. Add a case (dominant
  substitutions, keeping `#11`).

## 5. Small `pickRandom` helper

`array[Math.floor(Math.random() * array.length)]` appears ~16 times. One 2-line helper
in `chordUtils.ts` (or a tiny `random.ts`).

## 6. Clean up `page.tsx`

- `triggerRandomGeneration` is duplicated verbatim inside the `useEffect` — the effect
  should just call the function.
- Extract the two display blocks (`ChordGrid`, `SequenceGrid`) into small components so
  the page reads as layout instead of 120 lines of nested JSX. Nothing fancy — just
  moving existing JSX.

## 7. Delete dead code

- `tonal` and `uuid` in `package.json` — never imported anywhere. Remove.
- `console.log(numberOfSequences)` in `generateSequence`.
- `showNumberList = true` in `mainRandomGenerate` — always true, the `else` branch is
  unreachable.
- `window.innerWidth < 1024 ? 8 : 8` in `getDefaultFormOptions` — both branches are 8;
  just write `8` (also removes a `window` access during render).

## 8. Deduplicate the preset buttons

The three Save/Load preset button pairs in `OptionsForm` are identical except for
`A/B/C`. Map over `["A", "B", "C"]` instead of copy-pasting six buttons.

## 9. Make `useMetronome` understandable (no behavior change)

The scheduling algorithm itself is correct (it's the standard Web Audio "lookahead
scheduler" pattern) — the problem is that nothing explains it. Readability pass only:

- **Top-of-file comment** explaining the architecture in ~5 lines: JS timers are too
  jittery for audio, so a `setTimeout` loop wakes every 25ms and schedules any clicks
  falling in the next 100ms on the AudioContext's sample-accurate clock.
- **Explain the refs.** `settingsRef` / `onCycleCompleteRef` mirror React state because
  the scheduler runs outside React's render cycle and would otherwise see stale values.
  One comment where they're declared; same for `beatRef`/`measureCountRef` (audio-clock
  position) vs `metronomeState` (UI mirror).
- **Extract the sound.** Pull oscillator + envelope creation out of `scheduleNote` into
  a small `playClick(ctx, time, frequency)` — `scheduleNote` then reads as "decide
  pitch, play click, sync UI".
- **Name the magic numbers**: `1000/800/600` become `CYCLE_START_PITCH`,
  `DOWNBEAT_PITCH`, `OFFBEAT_PITCH`; same for the envelope constants.
- **Flatten the pitch decision** into one readable expression instead of the nested
  ternary + if/else.
- Verify no behavior change by ear + beat indicator (tempo, time signatures, cycle
  accent, chord switching on/off).

## 10. Tailwind cleanup (zero visual change)

The classes are long mostly because the same "design tokens" are hand-inlined everywhere.
Two moves, both invisible in the rendered output:

- **Name the colors.** Register the recurring raw values (`#ff389c`, `#ffc053`,
  `#ff3859`, `#ffe0f0`, `#7a3950`, `#574141`, `hsl(29,100%,90%)`, …) in `globals.css`
  under `@theme` (Tailwind v4), so `bg-[#ff389c]` becomes e.g. `bg-accent-pink`.
  Same computed CSS, but the palette becomes visible and greppable.
- **Extract the repeated widgets, not the class strings.** The form-input recipe
  (border-2 + themed bg + focus color) and its onBlur clamp logic are copy-pasted 4×
  (numberOfNotes, numberOfSequences, tempo, measures). One `ClampedNumberInput`
  component kills the longest duplicated class strings *and* the duplicated clamp JS.
  Labels get the same treatment via a tiny `FieldLabel` (or a shared constant) only
  where repeated 3+ times — no `@apply` soup for one-off classes.
- One-off decorative classes (the neobrutalist shadows, the decoration bars in
  `page.tsx`) stay inline — extracting them would just move noise around.
- Verify with a before/after screenshot comparison.

## Explicitly NOT doing

- No state-management library, no context, no reducers — prop drilling is fine at this size.
- No changes to the metronome *scheduling logic* — item 9 renames, comments, and
  extracts, but the algorithm and timing behavior stay identical.
- No visual changes — item 10 must produce pixel-identical output.
- No test framework setup (can do later if you want, but it's scope creep here).

## Order of work

1. Dead code removal (7) + the two guide-tone fixes from (4): repair the `alt`
   no-op splice so altered chords drop the natural 5, and add a `7#11` case.
2. Types + storage helpers (2, 3).
3. `CheckboxGroup` merge (1) + preset buttons (8).
4. `generateRandomTargetTone` table (4) + `pickRandom` (5) — carries over the two
   fixes from step 1.
5. `page.tsx` cleanup (6).
6. Verify: `npm run build` + manual click-through (randomize, options, presets, metronome).

## Order of work — round 2

1. `useMetronome` readability pass (9) — comments, naming, `playClick` extraction.
2. Tailwind color tokens in `@theme` (10) — mechanical rename, pixel-identical.
3. `ClampedNumberInput` + shared label treatment (10).
4. Verify: build + screenshot diff + metronome listen-through.
