import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// Fontes servidas pelo próprio app (sem Google Fonts): o IP de quem abre o convite não vai para terceiros (LGPD).
import '@fontsource/fraunces/latin-500.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import './index.css'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10_000 } } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
