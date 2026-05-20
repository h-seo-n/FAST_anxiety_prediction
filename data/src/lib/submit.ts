import type { SurveyPayload } from '../types'

const ENDPOINT = import.meta.env.VITE_APPS_SCRIPT_URL

/** Thrown when the request can't be sent (missing URL, offline, etc.). */
export class SubmitError extends Error {}

/**
 * POST the survey payload to the Apps Script Web App.
 *
 * CORS strategy (see CLAUDE.md): we send `text/plain` so the browser does NOT
 * issue a CORS preflight, and use `mode: 'no-cors'` so it won't block on the
 * header-less Apps Script response. The response is therefore OPAQUE — we
 * cannot read it — so a non-throwing fetch is treated as success. A thrown
 * error means the request never left the browser (no network / bad URL).
 */
export async function submitSurvey(payload: SurveyPayload): Promise<void> {
  if (!ENDPOINT) {
    throw new SubmitError(
      'VITE_APPS_SCRIPT_URL is not set. Copy .env.example to .env and paste your Apps Script Web App URL, then restart the dev server.',
    )
  }

  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      // text/plain keeps this a "simple request" (no preflight). Apps Script
      // reads the raw body via e.postData.contents and JSON.parse()s it.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })
  } catch (err) {
    throw new SubmitError(
      err instanceof Error ? err.message : 'Network request failed',
    )
  }
}
