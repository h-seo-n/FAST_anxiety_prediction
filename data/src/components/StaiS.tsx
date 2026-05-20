import { staiItems, STAI_ANCHORS, STAI_INSTRUCTION } from '../data/staiItems'
import { Bilingual, Card, PrimaryButton } from './ui'

export default function StaiS({
  responses,
  onChange,
  onComplete,
}: {
  responses: (number | null)[]
  onChange: (next: (number | null)[]) => void
  onComplete: () => void
}) {
  const remaining = responses.filter((r) => r === null).length
  const allAnswered = remaining === 0

  function setItem(i: number, value: number) {
    const next = [...responses]
    next[i] = value
    onChange(next)
  }

  function goToFirstUnanswered() {
    const i = responses.findIndex((r) => r === null)
    if (i >= 0) {
      document
        .getElementById(`stai-item-${i}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Card>
      <h1 className="text-xl font-bold">
        <Bilingual ko="상태 불안 척도 (STAI-S)" en="State Anxiety (STAI-S)" />
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        <Bilingual ko={STAI_INSTRUCTION.ko} en={STAI_INSTRUCTION.en} />
      </p>

      {/* Anchor legend (full bilingual labels, shown once). */}
      <div className="mt-4 grid grid-cols-1 gap-1 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 sm:grid-cols-2">
        {STAI_ANCHORS.map((a) => (
          <div key={a.value}>
            <span className="font-semibold text-gray-800">{a.value}</span> = {a.ko}{' '}
            <span className="font-light text-gray-500">({a.en})</span>
          </div>
        ))}
      </div>

      <ol className="mt-6 space-y-5">
        {staiItems.map((item, i) => {
          return (
            <li
              id={`stai-item-${i}`}
              key={i}
              className={`rounded-xl p-3`}
            >
              <p className="text-sm">
                <span className="font-semibold text-gray-700">{i + 1}.</span>{' '}
                {item.ko}
                <span className="block font-light text-gray-500">{item.en}</span>
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {STAI_ANCHORS.map((a) => {
                  const selected = responses[i] === a.value
                  return (
                    <button
                      key={a.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setItem(i, a.value)}
                      className={`rounded-lg border px-1 py-2 text-center transition ${
                        selected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
                      }`}
                    >
                      <span className="block text-base font-semibold">
                        {a.value}
                      </span>
                      <span
                        className={`block text-[10px] leading-tight ${
                          selected ? 'text-indigo-100' : 'text-gray-500'
                        }`}
                      >
                        {a.ko}
                      </span>
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-6">
        {!allAnswered && (
          <button
            type="button"
            onClick={goToFirstUnanswered}
            className="mb-2 w-full text-center text-xs text-indigo-600 underline"
          >
            {remaining}문항 남음 · 미응답 문항으로 이동 / {remaining} left · go to
            unanswered
          </button>
        )}
        <PrimaryButton onClick={onComplete} disabled={!allAnswered}>
          <Bilingual ko="다음" en="Next" />
        </PrimaryButton>
      </div>
    </Card>
  )
}
