import clsx from 'clsx'
import { Loader2, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
  secondary: 'bg-card text-ink border border-line hover:bg-soft',
  ghost: 'text-ink hover:bg-soft',
  danger: 'bg-no text-white hover:opacity-90',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 h-11 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'

export function Button({
  variant = 'primary',
  loading,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button className={clsx(base, variants[variant], className)} disabled={loading || rest.disabled} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', className, ...rest }: LinkProps & { variant?: Variant }) {
  return <Link className={clsx(base, variants[variant], className)} {...rest} />
}

export function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: ReactNode; id: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={id + '-err'} className="text-sm text-no" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  )
}

const control =
  'w-full rounded-xl border border-line bg-card px-3.5 text-[15px] placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 aria-[invalid=true]:border-no'

export function Input({ label, error, hint, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = useId()
  return (
    <Field label={label} error={error} hint={hint} id={id}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? id + '-err' : undefined} className={clsx(control, 'h-11', className)} {...rest} />
    </Field>
  )
}

export function Textarea({ label, error, hint, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  const id = useId()
  return (
    <Field label={label} error={error} hint={hint} id={id}>
      <textarea id={id} aria-invalid={!!error} rows={4} className={clsx(control, 'py-2.5', className)} {...rest} />
    </Field>
  )
}

export function Select({ label, error, children, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  const id = useId()
  return (
    <Field label={label} error={error} id={id}>
      <select id={id} aria-invalid={!!error} className={clsx(control, 'h-11', className)} {...rest}>
        {children}
      </select>
    </Field>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('rounded-2xl border border-line bg-card', className)}>{children}</div>
}

const tones = {
  neutral: 'bg-soft text-muted',
  brand: 'bg-brand-soft text-brand-dark',
  ok: 'bg-ok-soft text-ok',
  wait: 'bg-wait-soft text-wait',
  no: 'bg-no-soft text-no',
}

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>{children}</span>
}

export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted" role="status">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{text}</p>
      {action}
    </div>
  )
}

export function ErrorBox({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-no/30 bg-no-soft p-5 text-sm text-no" role="alert">
      <p>{error instanceof Error ? error.message : 'Algo deu errado.'}</p>
      {onRetry && (
        <button className="mt-2 font-semibold underline" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}

/** Modal com <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte sem biblioteca. */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={clsx(
        'm-auto w-[calc(100%-2rem)] rounded-2xl border border-line bg-card p-0 text-ink shadow-xl',
        wide ? 'max-w-2xl' : 'max-w-md',
      )}
    >
      {open && (
        <div className="max-h-[85dvh] overflow-y-auto p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="-m-1 rounded-lg p-1 text-muted hover:bg-soft" aria-label="Fechar">
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

export function Confirm({
  open,
  title,
  text,
  confirmLabel,
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <div role="tablist" className="inline-flex gap-1 rounded-xl bg-soft p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={clsx(
              'h-9 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors',
              value === t.id ? 'bg-card text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 text-xs text-muted">{t.count}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Switch({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; disabled?: boolean }) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <label htmlFor={id} className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx('relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50', checked ? 'bg-brand' : 'bg-line')}
      >
        <span className={clsx('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  )
}

export function Progress({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'ok' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-soft" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className={clsx('h-full rounded-full transition-all', tone === 'ok' ? 'bg-ok' : 'bg-brand')} style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight', className)}>
      <svg viewBox="0 0 64 64" className="size-7" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#e0523f" />
        <path d="M20 34.5l8 8 16-18" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      organizaki
    </span>
  )
}
