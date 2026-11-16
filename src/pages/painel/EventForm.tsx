import { ArrowLeft } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ImageUpload } from '../../components/ImageUpload'
import { toast } from '../../components/toast'
import { Button, Card, ErrorBox, Input, Spinner, Textarea } from '../../components/ui'
import { errorMessage, fieldErrors, post, put } from '../../lib/api'
import { todayISO } from '../../lib/format'
import { useEvent, useInvalidateAll } from '../../lib/queries'
import type { EventInput, EventItem } from '../../lib/types'

const empty: EventInput = { title: '', description: '', date: '', time: '', location: '', coverUrl: '' }

export default function EventForm() {
  const { id = '' } = useParams()
  const editing = !!id
  const event = useEvent(id)
  const navigate = useNavigate()
  const invalidate = useInvalidateAll()
  const [form, setForm] = useState<EventInput>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const e = event.data
    if (e) setForm({ title: e.title, description: e.description, date: e.date, time: e.time, location: e.location, coverUrl: e.coverUrl })
  }, [event.data])

  const set = (k: keyof EventInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const saved = editing ? await put<EventItem>(`/events/${id}`, form) : await post<EventItem>('/events', form)
      invalidate()
      toast.ok(editing ? 'Evento atualizado.' : 'Evento criado! Agora é só montar as listas.')
      navigate(`/painel/eventos/${saved.id}`, { replace: true })
    } catch (err) {
      const f = fieldErrors(err)
      if (Object.keys(f).length) setErrors(f)
      else toast.error(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (editing && event.isPending) return <Spinner />
  if (editing && event.error) return <ErrorBox error={event.error} />

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={editing ? `/painel/eventos/${id}` : '/painel'} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold sm:text-3xl">{editing ? 'Editar evento' : 'Novo evento'}</h1>
      <p className="mt-1 mb-6 text-muted">{editing ? 'As mudanças aparecem na hora para quem tem o link.' : 'Ele nasce como rascunho: só os convidados veem depois que você publicar.'}</p>
      <Card className="p-5 sm:p-6">
        <form onSubmit={submit} className="space-y-5" noValidate>
          <ImageUpload label="Foto de capa" value={form.coverUrl} onChange={(coverUrl) => setForm({ ...form, coverUrl })} />
          {errors.coverUrl && <p className="text-sm text-no">{errors.coverUrl}</p>}
          <Input label="Nome do evento" value={form.title} onChange={set('title')} error={errors.title} placeholder="Ex.: Casamento de Ana e Leo" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Data" type="date" min={editing ? undefined : todayISO()} value={form.date} onChange={set('date')} error={errors.date} />
            <Input label="Horário (opcional)" type="time" value={form.time} onChange={set('time')} error={errors.time} />
          </div>
          <Input label="Local" value={form.location} onChange={set('location')} error={errors.location} placeholder="Endereço ou nome do lugar" hint="Vira um link para o mapa na página do convite." />
          <Textarea label="Recado para os convidados" value={form.description} onChange={set('description')} error={errors.description} rows={5} placeholder="Conte o que vai acontecer, traje, horários…" />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {editing ? 'Salvar' : 'Criar evento'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
