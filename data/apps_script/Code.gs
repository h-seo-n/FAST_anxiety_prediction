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
var STAI_N = 20;
var BDI_N = 21;
var WORDS_PER_CHAIN = 10;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize concurrent submissions
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var cols = flattenPayload(data);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(cols.map(function (c) { return c.name; }));
    }
    sheet.appendRow(cols.map(function (c) { return c.value; }));

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
 * Flatten the payload into an ordered list of { name, value } columns. Header
 * and row are both derived from this list, so they can never drift apart.
 */
function flattenPayload(d) {
  var cols = [];
  function push(name, value) { cols.push({ name: name, value: cell(value) }); }

  push('participant_id', d.participant_id);
  push('submitted_at', d.submitted_at);

  var stai = d.stai_s || {};
  push('stai_s_total', stai.total);
  for (var i = 0; i < STAI_N; i++) {
    push('stai_s_' + (i + 1), at(stai.items, i));
  }

  var bdi = d.bdi || {};
  push('bdi_total', bdi.total);
  for (var j = 0; j < BDI_N; j++) {
    push('bdi_' + (j + 1), at(bdi.items, j));
  }

  var chains = d.word_chains || {};
  for (var s = 0; s < SEEDS.length; s++) {
    var key = SEEDS[s];
    var chain = chains[key] || {};
    var n = WORDS_PER_CHAIN;
    for (var w = 0; w < n; w++) push(key + '_w' + (w + 1), at(chain.words, w));
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
