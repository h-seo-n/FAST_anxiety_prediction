import { useEffect, useState } from 'react'
import Welcome from './components/Welcome'
import StaiS from './components/StaiS'
import Bdi from './components/Bdi'
import WordChain from './components/WordChain'
import ConceptRating from './components/ConceptRating'
import Submit from './components/Submit'
import { SEEDS } from './types'
import type { ChainData, ChainRatings, ChainWords, SeedKey, Step } from './types'

const emptyChain = (): ChainData => ({
  words: [],
  rt_ms: [],
  valence: [],
  time: [],
  self: [],
})

const STAI_COUNT = 20
const BDI_COUNT = 21

export default function App() {
  const [step, setStep] = useState<Step>('welcome')
  const [finished, setFinished] = useState(false)

  const [participantId, setParticipantId] = useState('')
  const [stai, setStai] = useState<(number | null)[]>(Array(STAI_COUNT).fill(null))
  const [bdi, setBdi] = useState<(number | null)[]>(Array(BDI_COUNT).fill(null))
  const [chains, setChains] = useState<Record<SeedKey, ChainData>>({
    coffee: emptyChain(),
    alcohol: emptyChain(),
    stress: emptyChain(),
  })

  // Word-chain stage cursor: which seed, and whether we're generating or rating.
  const [seedIndex, setSeedIndex] = useState(0)
  const [phase, setPhase] = useState<'generate' | 'rate'>('generate')

  // Warn before accidental navigation away while the survey is in progress.
  useEffect(() => {
    const inProgress = step !== 'welcome' && !finished
    if (!inProgress) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [step, finished])

  function renderStep() {
    switch (step) {
      case 'welcome':
        return (
          <Welcome
            participantId={participantId}
            onChange={setParticipantId}
            onStart={() => setStep('stai')}
          />
        )

      case 'stai':
        return (
          <StaiS
            responses={stai}
            onChange={setStai}
            onComplete={() => setStep('bdi')}
          />
        )

      case 'bdi':
        return (
          <Bdi
            responses={bdi}
            onChange={setBdi}
            onComplete={() => setStep('chains')}
          />
        )

      case 'chains': {
        const seed = SEEDS[seedIndex]
        if (phase === 'generate') {
          return (
            <WordChain
              key={`gen-${seed.key}`}
              seed={seed}
              index={seedIndex}
              total={SEEDS.length}
              onComplete={(result: ChainWords) => {
                setChains((prev) => ({
                  ...prev,
                  [seed.key]: { ...prev[seed.key], ...result },
                }))
                setPhase('rate')
              }}
            />
          )
        }
        return (
          <ConceptRating
            key={`rate-${seed.key}`}
            seed={seed}
            words={chains[seed.key].words}
            onComplete={(ratings: ChainRatings) => {
              setChains((prev) => ({
                ...prev,
                [seed.key]: { ...prev[seed.key], ...ratings },
              }))
              if (seedIndex < SEEDS.length - 1) {
                setSeedIndex(seedIndex + 1)
                setPhase('generate')
              } else {
                setStep('submit')
              }
            }}
          />
        )
      }

      case 'submit':
        return (
          <Submit
            participantId={participantId}
            stai={stai as number[]}
            bdi={bdi as number[]}
            chains={chains}
            onFinished={() => setFinished(true)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">{renderStep()}</div>
    </div>
  )
}
