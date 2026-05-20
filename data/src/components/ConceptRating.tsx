import { useState } from 'react'
import type { ChainRatings, SeedKey } from '../types'
import { Bilingual, Card, PrimaryButton } from './ui'

// Continuous-slider rating of each generated concept on three dimensions:
//   valence  [-1, 1]  negative .. neutral .. positive
//   time     [-1, 1]  past .. present .. future
//   self     [ 0, 1]  not self-relevant .. self-relevant
// Concepts are rated one at a time; every dimension must be set (touched)
// before advancing. `null` means "not yet set".

const STEP = 0.01

function Slider({
  labelKo,
  labelEn,
  min,
  max,
  ticks,
  value,
  onChange,
}: {
  labelKo: string
  labelEn: string
  min: number
  max: number
  ticks: { ko: string; en: string }[]
  value: number | null
  onChange: (v: number) => void
}) {
  const isSet = value !== null
  const display = value ?? (min + max) / 2
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-m font-medium text-gray-800">
          {labelKo} <span className="font-light text-gray-500">/ {labelEn}</span>
        </span>
        <span
          className='text-m tabular-nums text-indigo-700'
        >
          {isSet || '미설정 / not set'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={STEP}
        value={display}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onPointerDown={() => {
          if (!isSet) onChange(display) // engaging the slider counts as set
        }}
        className={`mt-2 w-full cursor-pointer accent-indigo-600 ${
          isSet ? '' : 'opacity-60'
        }`}
      />
      <div className="mt-1 flex justify-between text-[13px] leading-tight text-gray-500">
        {ticks.map((t, i) => (
          <span
            key={i}
            className={
              ticks.length === 3 && i === 1
                ? 'text-center'
                : i === ticks.length - 1
                  ? 'text-right'
                  : 'text-left'
            }
          >
            {t.ko}
            <span className="block font-light">{t.en}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ConceptRating({
  seed,
  words,
  onComplete,
}: {
  seed: { key: SeedKey; ko: string; en: string }
  words: string[]
  onComplete: (ratings: ChainRatings) => void
}) {
  const n = words.length
  const [idx, setIdx] = useState(0)
  const [valence, setValence] = useState<(number | null)[]>(Array(n).fill(null))
  const [time, setTime] = useState<(number | null)[]>(Array(n).fill(null))
  const [self, setSelf] = useState<(number | null)[]>(Array(n).fill(null))

  const set =
    (setter: React.Dispatch<React.SetStateAction<(number | null)[]>>) =>
    (v: number) =>
      setter((prev) => {
        const next = [...prev]
        next[idx] = v
        return next
      })

  const currentSet =
    valence[idx] !== null && time[idx] !== null && self[idx] !== null
  const isLast = idx === n - 1

  function handleNext() {
    if (!currentSet) return
    if (isLast) {
      onComplete({
        valence: valence as number[],
        time: time as number[],
        self: self as number[],
      })
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {seed.ko} / {seed.en} · 개념 평가 {idx + 1}/{n} · Concept {idx + 1} of {n}
      </p>

      <p className="mt-3 text-sm text-gray-600">
        <Bilingual
          ko="아래 단어에 대해 느끼는 바를 막대를 움직여 표시하세요."
          en="Move each slider to indicate how you feel about the word below."
        />
      </p>

      <div className="mt-3 rounded-xl bg-indigo-50 p-5 text-center">
        <p className="text-sm text-gray-500">평가할 단어 / Word to rate</p>
        <p className="break-words text-3xl font-bold text-indigo-700">
          {words[idx]}
        </p>
      </div>

      <div className="mt-6 space-y-7">
        <Slider
          labelKo="감정가"
          labelEn="Valence"
          min={-1}
          max={1}
          value={valence[idx]}
          onChange={set(setValence)}
          ticks={[
            { ko: '부정', en: 'negative' },
            { ko: '중립', en: 'neutral' },
            { ko: '긍정', en: 'positive' },
          ]}
        />
        <Slider
          labelKo="시간"
          labelEn="Time"
          min={-1}
          max={1}
          value={time[idx]}
          onChange={set(setTime)}
          ticks={[
            { ko: '과거', en: 'past' },
            { ko: '현재', en: 'present' },
            { ko: '미래', en: 'future' },
          ]}
        />
        <Slider
          labelKo="자기 관련성"
          labelEn="Self-relevance"
          min={0}
          max={1}
          value={self[idx]}
          onChange={set(setSelf)}
          ticks={[
            { ko: '관련 없음', en: 'not self-relevant' },
            { ko: '자기 관련', en: 'self-relevant' },
          ]}
        />
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          이전 / Back
        </button>
        <div className="flex-1">
          <PrimaryButton onClick={handleNext} disabled={!currentSet}>
            {isLast ? (
              <Bilingual ko="평가 완료" en="Finish rating" />
            ) : (
              <Bilingual ko="다음 단어" en="Next word" />
            )}
          </PrimaryButton>
        </div>
      </div>
      {!currentSet && (
        <p className="mt-2 text-center text-xs text-gray-500">
          세 가지 막대를 모두 움직여 주세요 / Please set all three sliders
        </p>
      )}
    </Card>
  )
}
