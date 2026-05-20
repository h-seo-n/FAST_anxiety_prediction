import type { StaiItem } from '../types'

// STAI-S (State-Trait Anxiety Inventory — State form), 20 items.
// NOTE : Korean ver is BEST-EFFORT TRANSLATION of the English, NOT the official Korean instrument. (copyright-limited)

/** Fixed 4-point Likert anchors for every STAI-S item (per CLAUDE.md). */
export const STAI_ANCHORS: { value: 1 | 2 | 3 | 4; ko: string; en: string }[] = [
  { value: 1, ko: '전혀 아니다', en: 'Not at all' },
  { value: 2, ko: '다소 그렇다', en: 'Somewhat' },
  { value: 3, ko: '보통 그렇다', en: 'Moderately so' },
  { value: 4, ko: '매우 그렇다', en: 'Very much so' },
]

/** Bilingual instruction shown above the items. */
export const STAI_INSTRUCTION = {
  ko: '아래 문장을 읽고 지금 이 순간 느끼는 바를 가장 잘 나타내는 답을 고르세요. 정답이나 오답은 없습니다.',
  en: 'Read each statement and select the response that best describes how you feel right now, at this very moment. There are no right or wrong answers.',
}

/**
 * The 20 STAI-S items in order. `reverseScored: true` marks anxiety-absent
 * items (1, 2, 5, 8, 10, 11, 15, 16, 19, 20), scored as (5 - raw).
 */
export const staiItems: StaiItem[] = [
  { ko: '나는 마음이 차분하다.', en: 'I feel calm', reverseScored: true }, // 1
  { ko: '나는 안정감을 느낀다.', en: 'I feel secure', reverseScored: true }, // 2
  { ko: '나는 긴장되어 있다.', en: 'I feel tense', reverseScored: false }, // 3
  { ko: '나는 긴장으로 경직되어 있다.', en: 'I feel strained', reverseScored: false }, // 4
  { ko: '나는 마음이 편하다.', en: 'I feel at ease', reverseScored: true }, // 5
  { ko: '나는 속이 상해 있다.', en: 'I feel upset', reverseScored: false }, // 6
  {
    ko: '나는 지금 닥칠지 모를 불행에 대해 걱정하고 있다.',
    en: 'I am presently worrying over possible misfortunes',
    reverseScored: false,
  }, // 7
  { ko: '나는 만족스럽다.', en: 'I feel satisfied', reverseScored: true }, // 8
  { ko: '나는 겁이 난다.', en: 'I feel frightened', reverseScored: false }, // 9
  { ko: '나는 편안함을 느낀다.', en: 'I feel comfortable', reverseScored: true }, // 10 (standard key)
  { ko: '나는 자신감이 있다.', en: 'I feel self-confident', reverseScored: true }, // 11
  { ko: '나는 초조하다.', en: 'I feel nervous', reverseScored: false }, // 12
  { ko: '나는 안절부절못한다.', en: 'I feel jittery', reverseScored: false }, // 13
  { ko: '나는 결단을 내리지 못하겠다.', en: 'I feel indecisive', reverseScored: false }, // 14
  { ko: '나는 긴장이 풀려 느긋하다.', en: 'I am relaxed', reverseScored: true }, // 15
  { ko: '나는 흡족하다.', en: 'I feel content', reverseScored: true }, // 16
  { ko: '나는 걱정하고 있다.', en: 'I am worried', reverseScored: false }, // 17
  { ko: '나는 혼란스럽다.', en: 'I feel confused', reverseScored: false }, // 18
  { ko: '나는 안정되어 있다.', en: 'I feel steady', reverseScored: true }, // 19
  { ko: '나는 기분이 좋다.', en: 'I feel pleasant', reverseScored: true }, // 20
]
