import { useState } from 'react'
import type { ChainData, SeedKey, SurveyPayload } from '../types'
import { SEEDS } from '../types'
import { computeBdiTotal, computeStaiTotal } from '../lib/scoring'
import { submitSurvey, SubmitError } from '../lib/submit'
import { Bilingual, Card, PrimaryButton } from './ui'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Submit({
  participantId,
  stai,
  bdi,
  chains,
  onFinished,
}: {
  participantId: string
  stai: number[]
  bdi: number[]
  chains: Record<SeedKey, ChainData>
  onFinished: () => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const staiTotal = computeStaiTotal(stai)
  const bdiTotal = computeBdiTotal(bdi)

  async function handleSubmit() {
    setStatus('submitting')
    setError('')
    const payload: SurveyPayload = {
      participant_id: participantId,
      submitted_at: new Date().toISOString(),
      stai_s: { items: stai, total: staiTotal },
      bdi: { items: bdi, total: bdiTotal },
      word_chains: chains,
    }
    try {
      await submitSurvey(payload)
      setStatus('success')
      onFinished()
    } catch (err) {
      setStatus('error')
      setError(
        err instanceof SubmitError || err instanceof Error
          ? err.message
          : 'Unknown error',
      )
    }
  }

  if (status === 'success') {
    return (
      <Card>
        <div className="text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-3 text-2xl font-bold">
            <Bilingual ko="제출 완료" en="Submitted" />
          </h1>
          <p className="mt-3 text-gray-600">
            <Bilingual
              ko="참여해 주셔서 감사합니다. 이제 창을 닫으셔도 됩니다."
              en="Thank you for participating. You may now close this window."
            />
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h1 className="text-xl font-bold">
        <Bilingual ko="제출" en="Submit" />
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        <Bilingual
          ko="아래 내용을 제출합니다. 제출 후에는 수정할 수 없습니다."
          en="The responses below will be submitted. They cannot be changed afterward."
        />
      </p>

      {/* Quick review summary. */}
      <dl className="mt-4 space-y-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <dt>참가자 ID / Participant ID</dt>
          <dd className="font-medium">{participantId}</dd>
        </div>
        <div className="flex justify-between">
          <dt>STAI-S 합계 / total</dt>
          <dd className="font-medium tabular-nums">{staiTotal}</dd>
        </div>
        <div className="flex justify-between">
          <dt>BDI 합계 / total</dt>
          <dd className="font-medium tabular-nums">{bdiTotal}</dd>
        </div>
        {SEEDS.map((s) => (
          <div key={s.key} className="flex justify-between">
            <dt>
              {s.ko} / {s.en} 단어 / words
            </dt>
            <dd className="font-medium tabular-nums">
              {chains[s.key].words.length}
            </dd>
          </div>
        ))}
      </dl>

      {status === 'error' && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">
            제출에 실패했습니다 / Submission failed
          </p>
          <p className="mt-1 break-words">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <PrimaryButton onClick={handleSubmit} disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <Bilingual ko="제출 중…" en="Submitting…" />
          ) : (
            <Bilingual ko="제출하기" en="Submit" />
          )}
        </PrimaryButton>
      </div>
    </Card>
  )
}
