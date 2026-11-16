import clsx from 'clsx'
import { CheckCircle2, XCircle } from 'lucide-react'
import { create } from 'zustand'

interface Toast {
  id: number
  text: string
  tone: 'ok' | 'error'
}

const useToasts = create<{ items: Toast[] }>(() => ({ items: [] }))
let seq = 0

function push(text: string, tone: Toast['tone']) {
  const id = ++seq
  useToasts.setState((s) => ({ items: [...s.items, { id, text, tone }] }))
  setTimeout(() => useToasts.setState((s) => ({ items: s.items.filter((t) => t.id !== id) })), 4000)
}

export const toast = {
  ok: (text: string) => push(text, 'ok'),
  error: (text: string) => push(text, 'error'),
}

export function Toaster() {
  const items = useToasts((s) => s.items)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'pointer-events-auto flex max-w-md items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg',
            t.tone === 'ok' ? 'bg-ink' : 'bg-no',
          )}
        >
          {t.tone === 'ok' ? <CheckCircle2 className="size-4 shrink-0" /> : <XCircle className="size-4 shrink-0" />}
          {t.text}
        </div>
      ))}
    </div>
  )
}
