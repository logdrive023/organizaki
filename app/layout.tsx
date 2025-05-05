import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Organizaki - Organize seus eventos em 3 passos",
  description:
    "Plataforma para organização de eventos como casamentos, aniversários e chás de bebê. Crie sua lista de presentes, gerencie convidados e muito mais.",
  keywords:
    "organização de eventos, casamento, aniversário, chá de bebê, lista de presentes, confirmação de presença, convites digitais",
  openGraph: {
    title: "Organizaki - Organize seus eventos em 3 passos",
    description:
      "Plataforma para organização de eventos como casamentos, aniversários e chás de bebê. Crie sua lista de presentes, gerencie convidados e muito mais.",
    url: "https://organizaki.com.br",
    siteName: "Organizaki",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Organizaki - Plataforma para organização de eventos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Organizaki - Organize seus eventos em 3 passos",
    description: "Plataforma para organização de eventos como casamentos, aniversários e chás de bebê.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://organizaki.com.br",
  },
  verification: {
    google: "google-site-verification-code", // Substitua pelo código real quando disponível
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Adicione o script do Google AdSense aqui */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {/* Adicione o script do Google Analytics aqui */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
