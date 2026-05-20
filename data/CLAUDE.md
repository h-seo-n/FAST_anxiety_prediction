# FAST Mini Project — Data Collection Website

## Goal
Build a single-page web app (React + Vite) for collecting participant data in a psychology study. Participants complete two clinical questionnaires (STAI-S, BDI) and a word chain generation task. All responses are submitted to a Google Sheet via Google Apps Script Web App.

## Tech stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (clean, minimal, mobile-friendly)
- **Storage backend**: Google Apps Script Web App endpoint (POST JSON → appends row to Google Sheet)
- **Hosting**: Static build deployable to Vercel/Netlify/GitHub Pages
- **No backend server** beyond the Apps Script endpoint

## Language
Bilingual UI: Korean (primary) + English (secondary, shown beneath Korean text in a lighter weight). All instructions, questionnaire items, and button labels should appear in both languages. No language toggle — both shown simultaneously.

## Survey flow (single SPA, step-by-step, no page reloads)

1. **Welcome screen**
   - Brief description of the study (placeholder text I'll fill in later — just leave a clearly marked `TODO` block)
   - Single text input for a **Participant ID** (alphanumeric, required, ≥3 chars)
   - "Start / 시작하기" button

2. **STAI-S (State-Trait Anxiety Inventory — State form, 20 items)**
   - Standard 4-point Likert scale: 1 = 전혀 아니다 (Not at all), 2 = 다소 그렇다 (Somewhat), 3 = 보통 그렇다 (Moderately so), 4 = 매우 그렇다 (Very much so)
   - Use the standard 20 STAI-S items. Include both Korean and English wording for each item.
   - Reverse-scored items must be handled correctly when computing the total (items 1, 2, 5, 8, 10, 11, 15, 16, 19, 20 are reverse-scored — verify against a standard reference and add a code comment citing the reversal logic).
   - Show one item per row; require all items before proceeding.

3. **BDI (Beck Depression Inventory, 21 items)**
   - Standard format: each item presents 4 statements (scored 0–3); participant selects one.
   - Korean + English statements for each option.
   - All 21 items required.

4. **Word chain generation task** (the core experimental task)
   - Three seed words, presented sequentially as separate sub-screens:
     1. **coffee / 커피**
     2. **alcohol / 술**
     3. **stress / 스트레스**
   - For each seed, the participant generates **exactly 10 chained words** (the seed itself is NOT counted in the 10).
   - **Chain logic**: each word must be associated with the *previous word in the chain*, not the original seed. So the flow is: seed → word 1 → word 2 → ... → word 10, where each arrow is a free association.
   - UI: show the seed prominently at the top, then 10 numbered input fields. Each field's label should display the previous word ("이전 단어 / Previous word: X") so the participant knows what they're associating from.
   - All 10 fields required, non-empty.

5. **Concept rating**
   - after generation of each chain, show each generated concept one by one and ask the users to rate the Valence / Time / Self relevance of the words. Do this for each chain when concept generation is complete before moving on to the next chain.
     - Valence : how user feels about the concept - negative, neutral, or positive. [-1, 1], -1 : negative, 0 : neutral, 1 : positive
     - Time : whether the user feels the concept is oriented to the past tense, the present, or the future. [-1, 1], -1: past, 0: present, 1: future
     - Self-relevance : whether the concept feels self-relevant or not. [0, 1], 0 : not relevant, 1 : self-relevant
    - the inputs for each content dimension rating must be in the format of a continuous sliding bar, with the labels for the ticks of the bar visible(i.e. negative - neutral - positive / past - present - future / not self-relevant - self-relevant)
    - the rating values must be all filled before the user can move on.

6. **Submission screen**
   - Show a "Submit / 제출하기" button.
   - On click: POST a JSON payload to the Apps Script endpoint.
   - Show a success or error message. On success, show a thank-you message and disable the form.

## Data payload (JSON sent to Apps Script)

```json
{
  "participant_id": "string",
  "submitted_at": "ISO8601 timestamp",
  "stai_s": {
    "items": [1, 2, 3, 4, ...],   // 20 raw scores, in order
    "total": 0                     // computed with reverse-scoring applied
  },
  "bdi": {
    "items": [0, 1, 2, 3, ...],   // 21 raw scores
    "total": 0
  },
  "word_chains": {
    "coffee":  { "words": ["w1", ..., "w10"], "rt_ms": [123, ...] },
    "alcohol": { "words": [...], "rt_ms": [...] },
    "stress":  { "words": [...], "rt_ms": [...] }
  }
}
```

## Google Apps Script side
Generate a separate `apps_script/Code.gs` file with:
- A `doPost(e)` function that parses the JSON body and appends a flattened row to the active sheet.
- The sheet should have a header row matching the flattened column structure (participant_id, submitted_at, stai_s_total, stai_s_1 ... stai_s_20, bdi_total, bdi_1 ... bdi_21, coffee_w1 ... coffee_w10, coffee_rt1 ... coffee_rt10, and likewise for alcohol and stress).
- Include a comment at the top with deployment instructions: Extensions → Apps Script → paste → Deploy as Web App → Execute as: me, Access: anyone → copy URL into the React app's `.env` as `VITE_APPS_SCRIPT_URL`.
- Handle CORS: return JSON with appropriate headers (Apps Script requires `ContentService.createTextOutput(...).setMimeType(ContentService.MimeType.JSON)`; note that Apps Script web apps don't support custom CORS headers — the React app should use `fetch` with `mode: "no-cors"` OR send as `text/plain` content-type to avoid preflight). Pick the approach that lets the React app actually read the response; if `no-cors` is used, the app should treat any non-throwing fetch as success.

## Project structure
├── CLAUDE.md
├── README.md                 # setup + deployment instructions
├── .env.example              # VITE_APPS_SCRIPT_URL=
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx               # routing between steps
│   ├── components/
│   │   ├── Welcome.tsx
│   │   ├── StaiS.tsx
│   │   ├── Bdi.tsx
│   │   ├── WordChain.tsx     # reused for all 3 seeds
│   │   └── Submit.tsx
│   ├── data/
│   │   ├── staiItems.ts      # array of {ko, en, reverseScored}
│   │   └── bdiItems.ts       # array of {ko: [4 statements], en: [4 statements]}
│   ├── lib/
│   │   ├── scoring.ts        # computeStaiTotal, computeBdiTotal
│   │   └── submit.ts         # POST to Apps Script
│   └── types.ts
└── apps_script/
└── Code.gs


## Implementation order
1. Scaffold Vite + React + TS + Tailwind, confirm `npm run dev` works
2. Set up routing (simple `useState` step machine; no react-router needed)
3. Implement `Welcome.tsx`
4. Implement `WordChain.tsx` first (it's the most novel piece — get the per-word RT capture working with focus/blur listeners)
5. Implement `StaiS.tsx` and `BdiItems.ts` data file (you'll need to source the standard 20/21 items — leave a clearly marked block where I should paste the official Korean translations if you can't find them confidently; do NOT invent items)
6. Implement `Bdi.tsx`
7. Implement scoring functions with unit-test-style assertions in a comment block
8. Implement `Submit.tsx` and `submit.ts`
9. Write the `Code.gs` Apps Script
10. Write `README.md` with deployment steps

## Important notes
- **Don't fabricate clinical questionnaire items.** If you're uncertain about exact wording (especially Korean translations), insert a clearly labeled `// TODO: VERIFY ITEM TEXT AGAINST OFFICIAL SOURCE` and use a best-effort placeholder. I will verify against the published Korean STAI (한국판 상태-특성 불안 척도) and Korean BDI before deploying.
- Mobile-responsive (participants may use phones).
- Prevent accidental data loss: warn on `beforeunload` if the survey is in progress.
- No analytics, no tracking, no external fonts beyond what Tailwind ships with.
- Keep the codebase small and readable — this is a research prototype, not a product.

Start by scaffolding the project and confirming the dev server runs. Then proceed through the implementation order above. Pause and ask if anything is ambiguous.