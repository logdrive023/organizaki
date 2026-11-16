// No GitHub Pages o app mora em /organizaki/ (BASE_URL); no dev e no servidor próprio, na raiz.
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Arquivo de public/ (ex.: asset('img/x.webp')). */
export const asset = (p: string) => `${base}/${p.replace(/^\//, '')}`

/** Endereço completo de uma rota do app, para copiar e mandar (convite, link do evento). */
export const appUrl = (route: string) => `${location.origin}${base}${route}`

export const DEMO = import.meta.env.VITE_DEMO === 'true'
