// Shared types and constants for the FAST data-collection app.

/** Top-level screens of the single-page step machine. */
export type Step = 'welcome' | 'stai' | 'bdi' | 'chains' | 'submit'

export type SeedKey = 'coffee' | 'alcohol' | 'stress'

/** The three word-chain seeds, in presentation order. */
export const SEEDS: { key: SeedKey; ko: string; en: string }[] = [
  { key: 'coffee', ko: '커피', en: 'coffee' },
  { key: 'alcohol', ko: '술', en: 'alcohol' },
  { key: 'stress', ko: '스트레스', en: 'stress' },
]

/** Words the participant generates per seed (the seed itself is not counted). */
export const WORDS_PER_CHAIN = 10

/**
 * One STAI-S item. `reverseScored` items contribute (5 - raw) to the total;
 * see lib/scoring.ts for the reversal logic and citation.
 */
export interface StaiItem {
  ko: string
  en: string
  reverseScored: boolean
}

/** One BDI item: four statements, index = score (0..3), in each language. */
export interface BdiItem {
  ko: [string, string, string, string]
  en: [string, string, string, string]
}

/**
 * Per-seed chain data. All arrays are index-aligned and length WORDS_PER_CHAIN.
 * valence/time are in [-1, 1]; self is in [0, 1].
 */
export interface ChainData {
  words: string[]
  rt_ms: number[]
  valence: number[] // [-1, 1]  negative .. neutral .. positive
  time: number[] //    [-1, 1]  past .. present .. future
  self: number[] //    [ 0, 1]  not self-relevant .. self-relevant
}

/** Result returned by the word-generation screen. */
export interface ChainWords {
  words: string[]
  rt_ms: number[]
}

/** Result returned by the concept-rating screen. */
export interface ChainRatings {
  valence: number[]
  time: number[]
  self: number[]
}

/** The JSON payload POSTed to the Apps Script endpoint. */
export interface SurveyPayload {
  participant_id: string
  submitted_at: string // ISO8601
  stai_s: { items: number[]; total: number }
  bdi: { items: number[]; total: number }
  word_chains: Record<SeedKey, ChainData>
}
