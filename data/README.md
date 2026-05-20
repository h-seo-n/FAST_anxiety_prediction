# Free Association Semantic Task(FAST) Data Collection Website

A single-page React app for collecting FAST data: two clinical questionnaires (**STAI-S**, **BDI**) plus a **word-chain generation task** with per-concept ratings. Responses are POSTed to a Google Apps Script Web App that appends a row to a Google Sheet. The UI is bilingual (Korean primary, English secondary).

> simple prototype, not a product. See `CLAUDE.md` for the full spec.

---

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Storage: Google Apps Script Web App → Google Sheet (no app server)

## Survey flow

Welcome (Participant ID) → STAI-S (20 items) → BDI (21 items) → three word
chains (coffee / 커피, alcohol / 술, stress / 스트레스), each: generate 10
chained words, then rate every word on valence / time / self-relevance →
Submit.

---

## Local development

Prerequisites: Node 18+ and npm.

```bash
npm install
cp .env.example .env       # then paste your Apps Script URL into .env
npm run dev                # http://localhost:5173
```

Other scripts:

```bash
npm run build              # typecheck + production build to dist/
npm run preview            # preview the production build
npm run typecheck          # tsc --noEmit
```

> Vite reads `.env` only at startup — restart `npm run dev` after editing it.
> Until `VITE_APPS_SCRIPT_URL` is set, everything works except the final submit,
> which will show an error explaining the missing URL.

---

## Backend setup (Google Apps Script)

1. Open (or create) the Google Sheet that will store responses.
2. **Extensions → Apps Script**.
3. Replace the default code with the contents of [`apps_script/Code.gs`](apps_script/Code.gs). Save.
4. **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Deploy, authorize when prompted, and copy the **Web app URL**.
6. Put the URL in `.env`:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   ```
7. Restart `npm run dev`.

The script writes the header row automatically on the first submission, so you
can start from a blank sheet. After editing `Code.gs`, redeploy a **new version**
of the existing deployment for changes to take effect at the same URL.

### Why `no-cors` / `text/plain`?

Apps Script web apps can't set custom CORS headers. The app sends the body as
`text/plain` (avoids a CORS preflight) with `fetch(..., { mode: 'no-cors' })`,
so the browser won't block on the header-less response. The response is opaque
and **cannot be read**, so the app treats any non-throwing fetch as success; a
thrown error means the request never left the browser (offline / bad URL).
Verify rows are actually landing in the Sheet during piloting.

---

## Data payload

```jsonc
{
  "participant_id": "AB12",
  "submitted_at": "2026-05-20T09:00:00.000Z",
  "stai_s": { "items": [/* 20 raw 1–4 */], "total": 0 /* reverse-scored */ },
  "bdi":    { "items": [/* 21 raw 0–3 */], "total": 0 },
  "word_chains": {
    "coffee":  { "words": ["…×10"], "rt_ms": [/*×10*/],
                 "valence": [/*−1..1 ×10*/], "time": [/*−1..1 ×10*/], "self": [/*0..1 ×10*/] },
    "alcohol": { "…": "…" },
    "stress":  { "…": "…" }
  }
}
```

The sheet row is the flattened form: `participant_id, submitted_at,
stai_s_total, stai_s_1…20, bdi_total, bdi_1…21,` then for each seed
`{seed}_w1…10, {seed}_rt1…10, {seed}_val1…10, {seed}_time1…10, {seed}_self1…10`.

- **`rt_ms`** is the total time (ms) each word field was focused (focus→blur
  dwell). See `src/components/WordChain.tsx` to change the RT definition.
- **STAI-S total** applies reverse scoring `(5 − raw)` to items
  1, 2, 5, 8, 10, 11, 15, 16, 19, 20. See `src/lib/scoring.ts`.

---

## Project structure

```
├── apps_script/Code.gs        # doPost: append flattened row to the Sheet
├── src/
│   ├── App.tsx                # useState step machine + beforeunload guard
│   ├── components/            # Welcome, StaiS, Bdi, WordChain, ConceptRating, Submit, ui
│   ├── data/                  # staiItems.ts, bdiItems.ts (bilingual)
│   ├── lib/                   # scoring.ts, submit.ts
│   └── types.ts
├── .env.example               # VITE_APPS_SCRIPT_URL=
└── CLAUDE.md                  # full spec
```

## Deploying the frontend

`npm run build` outputs a static site to `dist/`, deployable to Vercel, Netlify,
or GitHub Pages. Set `VITE_APPS_SCRIPT_URL` as a build-time env var on the host
(it is inlined at build time, so rebuild after changing it).
