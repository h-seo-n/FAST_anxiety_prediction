// Small shared UI helpers. Korean is primary; English is shown beneath it in a
// lighter weight (no language toggle — both are always visible).
import type { ReactNode } from 'react'

/** Korean primary text with English secondary text underneath. */
export function Bilingual({
  ko,
  en,
  className = '',
  koClassName = '',
  enClassName = '',
}: {
  ko: string
  en: string
  className?: string
  koClassName?: string
  enClassName?: string
}) {
  return (
    <span className={className}>
      <span className={koClassName}>{ko}</span>
      <span className={`block font-light text-gray-500 ${enClassName}`}>{en}</span>
    </span>
  )
}

/** White card container used to frame each step screen. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
      {children}
    </div>
  )
}

/** Primary action button (full width on mobile). */
export function PrimaryButton({
  onClick,
  disabled,
  children,
  type = 'button',
}: {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {children}
    </button>
  )
}
