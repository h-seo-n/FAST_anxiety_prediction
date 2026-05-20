import { useRef, useState } from 'react'
import { WORDS_PER_CHAIN } from '../types'
import type { ChainWords, SeedKey } from '../types'
import { Bilingual, Card, PrimaryButton } from './ui'

// RT semantics
// ------------
// rt_ms[i] is the total time (ms) the input for word i was focused, accumulated
// across focus→blur intervals. Words are entered ONE AT A TIME and the input is
// cleared after each, so the participant never sees the words written so far —
// only the single previous word they are associating from (the seed for word 1).
// Committed words and RTs live in refs and are intentionally never rendered.

export default function WordChain({
  seed,
  index,
  total,
  onComplete,
}: {
  seed: { key: SeedKey; ko: string; en: string }
  index: number
  total: number
  onComplete: (result: ChainWords) => void
}) {
  const [step, setStep] = useState(0) // which word: 0 .. WORDS_PER_CHAIN-1
  const [current, setCurrent] = useState('') // text in the input right now

  const wordsRef = useRef<string[]>(Array(WORDS_PER_CHAIN).fill(''))
  const rtRef = useRef<number[]>(Array(WORDS_PER_CHAIN).fill(0))
  const focusStartRef = useRef<number | null>(null)

  const isFirst = step === 0
  const isLast = step === WORDS_PER_CHAIN - 1
  const canAdvance = current.trim().length > 0

  // The word being associated FROM: the seed for word 1, otherwise the
  // immediately previous word (chain = seed → w1 → w2 → … → w10).
  const previousWord = isFirst
    ? `${seed.ko} / ${seed.en}`
    : wordsRef.current[step - 1]

  function handleFocus() {
    focusStartRef.current = performance.now()
  }

  function handleBlur() {
    if (focusStartRef.current !== null) {
      rtRef.current[step] += performance.now() - focusStartRef.current
      focusStartRef.current = null
    }
  }

  function handleNext() {
    if (!canAdvance) return
    handleBlur() // flush RT if still focused (e.g. submitted via Enter)
    wordsRef.current[step] = current.trim()
    if (isLast) {
      onComplete({
        words: [...wordsRef.current],
        rt_ms: rtRef.current.map((ms) => Math.round(ms)),
      })
    } else {
      setStep(step + 1)
      setCurrent('') // clear → previously typed words stay hidden
    }
  }

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        단어 연상 {index + 1}/{total} · 단어 {step + 1}/{WORDS_PER_CHAIN} · word{' '}
        {step + 1} of {WORDS_PER_CHAIN}
      </p>

      <div className="mt-3 rounded-xl bg-indigo-50 p-5 text-center">
        <p className="text-sm text-gray-500">
          {isFirst ? '제시어 / Seed word' : '이전 단어 / Previous word'}
        </p>
        <p className="break-words text-3xl font-bold text-indigo-700">
          {previousWord}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        <Bilingual
          ko="위 단어에서 자유롭게 떠오르는 단어 하나를 입력하세요. 각 단어는 제시어가 아니라 바로 앞 단어와 연결됩니다."
          en="Enter one word freely associated with the word above. Each word connects to the previous word — not to the seed."
        />
      </p>

      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleNext()
        }}
      >
        <input
          key={step}
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={`word ${step + 1}`}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="mt-6">
          <PrimaryButton type="submit" disabled={!canAdvance}>
            {isLast ? (
              <Bilingual ko="다음 (평가하기)" en="Next (rate the words)" />
            ) : (
              <Bilingual ko="다음 단어" en="Next word" />
            )}
          </PrimaryButton>
          {!canAdvance && (
            <p className="mt-2 text-center text-xs text-gray-500">
              단어를 입력해 주세요 / Please enter a word
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}
