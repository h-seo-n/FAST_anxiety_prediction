import { Bilingual, Card, PrimaryButton } from './ui'

const ID_PATTERN = /^[A-Za-z0-9]+$/
const MIN_ID_LEN = 3

/** Returns true when the participant ID is alphanumeric and ≥3 chars. */
export function isValidParticipantId(id: string): boolean {
  return ID_PATTERN.test(id) && id.length >= MIN_ID_LEN
}

export default function Welcome({
  participantId,
  onChange,
  onStart,
}: {
  participantId: string
  onChange: (id: string) => void
  onStart: () => void
}) {
  const valid = isValidParticipantId(participantId)
  const showError = participantId.length > 0 && !valid

  return (
    <Card>
      <h1 className="text-2xl font-bold tracking-tight">
        <Bilingual ko="데이터 수집 안내" en="Data Collection Information" />
      </h1>
      <div className="mt-4 rounded-xl border border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">자유 연상 과제를 통한 상태 불안 예측 연구 - Predicting State Anxiety from Free Association Data</p>
        <p className="mt-2 leading-relaxed">
          안녕하세요. 본 페이지는 '모바일 컴퓨팅과 응용(001)' 강좌의 미니 프로젝트 일환으로 진행되는 데이터 수집 페이지입니다. 본 연구는 자유 연상 과제 수행 시 생성되는 단어 데이터를 통해 응답자의 상태 불안 수준을 예측하는 모델을 학습시키는 것을 목적으로 합니다.
          과제는 다음 세 단계로 구성됩니다:

          상태 불안 척도 (STAI-S, 20문항)
          우울 척도 (BDI, 21문항)
          세 개의 제시어(커피 · 술 · 스트레스)에 대한 단어 연상 과제

          모든 응답은 익명으로 수집·처리되며, 강좌 내 학술적 목적 외에는 사용되지 않습니다. 예상 소요 시간은 약 10분입니다.
          참여에 진심으로 감사드립니다.
        </p>
        <p className="mt-1 leading-relaxed text-amber-800">
          Hello. This page is part of a mini project for the Mobile Computing and Its Applications (001) course. The study aims to train a predictive model of state anxiety using word data generated through a free association task.
          The session consists of three parts:

          State anxiety scale (STAI-S, 20 items)
          Depression scale (BDI, 21 items)
          Word association task for three cue words (coffee, alcohol, stress)

          All responses are collected and processed anonymously and will be used solely for academic purposes within this course. The session takes approximately 10 minutes.
          Thank you sincerely for your participation.
        </p>
      </div>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) onStart()
        }}
      >
        <label htmlFor="participant-id" className="block text-sm font-medium">
          <Bilingual ko="참가자 ID" en="Participant ID" />
        </label>
        <input
          id="participant-id"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={participantId}
          onChange={(e) => onChange(e.target.value.trim())}
          aria-invalid={showError}
          placeholder="예: AB12 / e.g. AB12"
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p
          className={`mt-2 text-xs ${showError ? 'text-red-600' : 'text-gray-500'}`}
        >
          <Bilingual
            ko="영문/숫자 3자 이상 (특수문자·공백 불가)"
            en="Letters and digits only, at least 3 characters (no spaces or symbols)"
          />
        </p>

        <div className="mt-6">
          <PrimaryButton type="submit" disabled={!valid}>
            <Bilingual ko="시작하기" en="Start" />
          </PrimaryButton>
        </div>
      </form>
    </Card>
  )
}
