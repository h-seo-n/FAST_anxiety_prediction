import { bdiItems, BDI_INSTRUCTION } from '../data/bdiItems'
import { Bilingual, Card, PrimaryButton } from './ui'

export default function Bdi({
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
        .getElementById(`bdi-item-${i}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <Card>
      <h1 className="text-xl font-bold">
        <Bilingual ko="우울 척도 (BDI)" en="Depression (BDI)" />
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        <Bilingual ko={BDI_INSTRUCTION.ko} en={BDI_INSTRUCTION.en} />
      </p>

      <ol className="mt-6 space-y-6">
        {bdiItems.map((item, i) => (
          <li id={`bdi-item-${i}`} key={i}>
            <p className="text-sm font-semibold text-gray-700">{i + 1}.</p>
            <div className="mt-2 space-y-2">
              {item.en.map((_, opt) => {
                const selected = responses[i] === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setItem(i, opt)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-xs font-semibold ${
                        selected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-400 text-gray-500'
                      }`}
                    >
                      {opt}
                    </span>
                    <span className="text-sm">
                      {item.ko[opt]}
                      <span className="block font-light text-gray-500">
                        {item.en[opt]}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </li>
        ))}
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
