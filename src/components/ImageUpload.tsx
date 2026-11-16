import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import { errorMessage, uploadImage } from '../lib/api'
import { toast } from './toast'

const MAX = 5 * 1024 * 1024

/** Envia a imagem para a API na hora e guarda só a URL (o legado mandava base64 dentro do JSON). */
export function ImageUpload({ label, value, onChange, aspect = 'aspect-[16/9]' }: { label: string; value: string; onChange: (url: string) => void; aspect?: string }) {
  const id = useId()
  const [busy, setBusy] = useState(false)

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX) {
      toast.error('A imagem passa de 5 MB.')
      return
    }
    setBusy(true)
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium">{label}</span>
      <div className={`relative overflow-hidden rounded-xl border border-dashed border-line bg-soft ${aspect}`}>
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-card/90 shadow" aria-label="Remover imagem">
              <Trash2 className="size-4" />
            </button>
          </>
        ) : (
          <label htmlFor={id} className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-sm text-muted hover:text-ink">
            {busy ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            {busy ? 'Enviando…' : 'Escolher imagem (JPG, PNG ou WEBP, até 5 MB)'}
          </label>
        )}
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} disabled={busy} />
      </div>
    </div>
  )
}
