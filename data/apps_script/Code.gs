/**
 * FAST data-collection — Google Apps Script Web App backend.
 *
 * WHAT IT DOES
 *   Receives the JSON payload POSTed by the React app and appends one flattened
 *   row to the active sheet. On the first submission it also writes the header
 *   row, so you can start from a blank sheet.
 *
 * DEPLOYMENT
 *   1. Open the Google Sheet that should store responses.
 *   2. Extensions → Apps Script.
 *   3. Delete any boilerplate and paste THIS file's contents. Save.
 *   4. Deploy → New deployment → type "Web app".
 *        - Description:  FAST collector
 *        - Execute as:   Me
 *        - Who has access: Anyone
 *   5. Deploy, authorize when prompted, and copy the Web app URL.
 *   6. In the React project, copy `.env.example` to `.env` and set:
 *        VITE_APPS_SCRIPT_URL=<the Web app URL>
 *      Restart `npm run dev` (Vite only reads .env at startup).
 *   • After editing this script, redeploy ("Manage deployments" → edit → new
 *     version) for changes to take effect at the same URL.
 *
 * CORS
 *   Apps Script web apps cannot set custom CORS headers. The React app sends
 *   the body as `text/plain` (no preflight) using `mode: 'no-cors'`, so the
 *   browser never reads this response — it treats a non-throwing fetch as
 *   success. The JSON returned below is only useful when testing the URL
 *   directly (e.g. with curl or the doGet health check).
 */

var SEEDS = ['coffee', 'alcohol', 'stress'];
var WORDS_PER_CHAIN = 10;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize concurrent submissions
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var cols = flattenPayload(data);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, cols.length)
        .setValues([cols.map(function (c) { return c.name; })]);
    }
    writeRow(sheet, sheet.getLastRow() + 1, cols);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Simple health check: open the Web app URL in a browser to verify it's live. */
function doGet() {
  return jsonOutput({ ok: true, service: 'FAST collector' });
}

/**
 * Run this ONCE from the editor (select setupSheet in the toolbar → Run) to
 * (re)build the header row and lock the text columns to plain-text format.
 * Use it when the sheet already has data or when the column layout changed
 * (e.g. after dropping the per-item STAI/BDI columns). It overwrites row 1 and
 * reformats the text columns, but does NOT delete existing data rows — if the
 * columns changed, clear old rows first or they'll be misaligned.
 */
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cols = flattenPayload({}); // names only; all values blank
  sheet.getRange(1, 1, 1, cols.length)
    .setValues([cols.map(function (c) { return c.name; })]);

  var maxRows = sheet.getMaxRows();
  if (maxRows > 1) {
    for (var i = 0; i < cols.length; i++) {
      if (cols[i].text) sheet.getRange(2, i + 1, maxRows - 1, 1).setNumberFormat('@');
    }
  }
  sheet.setFrozenRows(1);
}

/**
 * Write one data row. Text columns are forced to plain-text number format ('@')
 * BEFORE the values are written, so Google Sheets does not silently coerce
 * string answers into numbers or dates (e.g. "007" → 7, "3/4" → a date). The
 * format is set first, then the values, which is what makes the text stick.
 */
function writeRow(sheet, row, cols) {
  var range = sheet.getRange(row, 1, 1, cols.length);
  range.setNumberFormats([cols.map(function (c) { return c.text ? '@' : '0.######'; })]);
  range.setValues([cols.map(function (c) { return c.value; })]);
}

/**
 * Flatten the payload into an ordered list of { name, value, text } columns.
 * Header and row are both derived from this list, so they can never drift
 * apart. `text: true` marks columns that must stay verbatim strings.
 *
 * NOTE: STAI-S and BDI are stored as composite totals only (one column each).
 * The app still sends the individual items, but we intentionally do not write
 * them, per study requirements.
 */
function flattenPayload(d) {
  var cols = [];
  function push(name, value, text) {
    cols.push({ name: name, value: cell(value), text: !!text });
  }

  push('participant_id', d.participant_id, true);
  push('submitted_at', d.submitted_at, true);

  push('stai_s_total', (d.stai_s || {}).total);
  push('bdi_total', (d.bdi || {}).total);

  var chains = d.word_chains || {};
  for (var s = 0; s < SEEDS.length; s++) {
    var key = SEEDS[s];
    var chain = chains[key] || {};
    var n = WORDS_PER_CHAIN;
    for (var w = 0; w < n; w++) push(key + '_w' + (w + 1), at(chain.words, w), true);
    for (var r = 0; r < n; r++) push(key + '_rt' + (r + 1), at(chain.rt_ms, r));
    for (var v = 0; v < n; v++) push(key + '_val' + (v + 1), at(chain.valence, v));
    for (var t = 0; t < n; t++) push(key + '_time' + (t + 1), at(chain.time, t));
    for (var f = 0; f < n; f++) push(key + '_self' + (f + 1), at(chain.self, f));
  }

  return cols;
}

/** Array element or undefined if missing. */
function at(arr, i) {
  return Array.isArray(arr) ? arr[i] : undefined;
}

/** Normalize a value for a cell: keep 0 / negatives, blank out null/undefined. */
function cell(x) {
  return (x === undefined || x === null) ? '' : x;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
