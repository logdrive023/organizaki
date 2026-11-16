/** Só volta para caminhos internos: "?volta=https://site-malicioso" não vira redirecionamento aberto. */
export function safeBack(v: string | null) {
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/painel'
}
