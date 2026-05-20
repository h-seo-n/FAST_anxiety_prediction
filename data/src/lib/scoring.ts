import { staiItems } from '../data/staiItems'

// =============================================================================
// Questionnaire scoring.
//
// STAI-S reversal logic
// ---------------------
// The STAI-S is a 4-point scale (1..4). Ten items are "anxiety-absent" (e.g.
// "I feel calm") and are REVERSE-scored so that a high contribution always
// means more anxiety. For a reverse-scored item the contribution is (5 - raw),
// i.e. 1↔4 and 2↔3. The reverse-scored items are 1, 2, 5, 8, 10, 11, 15, 16,
// 19, 20 (1-based), flagged as `reverseScored` in data/staiItems.ts.
//
// Reference: Spielberger, C. D., Gorsuch, R. L., & Lushene, R. E. Manual for
// the State-Trait Anxiety Inventory (STAI). Consulting Psychologists Press.
// The (5 - raw) reversal for a 1–4 anchor and this exact reverse-item set are
// the published STAI State-form scoring key. Total range: 20 (min) .. 80 (max).
// =============================================================================

/**
 * Sum the 20 STAI-S raw scores (each 1..4, in item order), applying reverse
 * scoring to the flagged items. Returns the standard total (20..80).
 */
export function computeStaiTotal(rawScores: number[]): number {
  return rawScores.reduce((sum, raw, i) => {
    const reversed = staiItems[i]?.reverseScored ?? false
    return sum + (reversed ? 5 - raw : raw)
  }, 0)
}

/**
 * Sum the 21 BDI raw scores (each 0..3). Returns the total (0..63).
 */
export function computeBdiTotal(rawScores: number[]): number {
  return rawScores.reduce((sum, raw) => sum + raw, 0)
}

// -----------------------------------------------------------------------------
// Unit-test-style assertions (sanity checks). These document expected behaviour;
// paste into a test runner, or run the file under tsx/node to self-check.
//
//   import { computeStaiTotal, computeBdiTotal } from './scoring'
//   import { staiItems } from '../data/staiItems'
//
//   // Uniform fills are symmetric: 10 reverse + 10 non-reverse items mean any
//   // constant k gives 10*(5-k) + 10*k = 50.
//   console.assert(computeStaiTotal(Array(20).fill(1)) === 50, 'STAI all-1 → 50')
//   console.assert(computeStaiTotal(Array(20).fill(4)) === 50, 'STAI all-4 → 50')
//
//   // Lowest possible anxiety: anxiety-present items = 1, anxiety-absent = 4.
//   const minAnx = staiItems.map((it) => (it.reverseScored ? 4 : 1))
//   console.assert(computeStaiTotal(minAnx) === 20, 'STAI min anxiety → 20')
//
//   // Highest possible anxiety: anxiety-present items = 4, anxiety-absent = 1.
//   const maxAnx = staiItems.map((it) => (it.reverseScored ? 1 : 4))
//   console.assert(computeStaiTotal(maxAnx) === 80, 'STAI max anxiety → 80')
//
//   // Spot check: item 1 (reverse) raw 1 contributes 4; item 3 (non-reverse)
//   // raw 1 contributes 1. Single non-zero among 1s:
//   //   all-1 baseline is 50; raising item 1 (reverse) from 1→4 subtracts 3 → 47.
//   const t = Array(20).fill(1); t[0] = 4
//   console.assert(computeStaiTotal(t) === 47, 'STAI reverse item lowers total')
//
//   console.assert(computeBdiTotal(Array(21).fill(0)) === 0, 'BDI all-0 → 0')
//   console.assert(computeBdiTotal(Array(21).fill(3)) === 63, 'BDI all-3 → 63')
//   console.assert(computeBdiTotal([1, 2, 3, ...Array(18).fill(0)]) === 6, 'BDI sum')
// -----------------------------------------------------------------------------
