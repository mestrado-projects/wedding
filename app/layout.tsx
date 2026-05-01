import type { Metadata } from 'next'
import { Montserrat, Playfair_Display, Great_Vibes } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-the-seasons",
  display: "swap"
});

const greatVibes = Great_Vibes({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wt-hilton",
  display: "swap"
});

export const metadata: Metadata = {
  title: 'Yara & Gustavo - Save the Weekend - 29 a 31 de Maio de 2027',
  description: 'Save the Weekend de Yara e Gustavo. Confirme sua presença para nosso fim de semana especial.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${playfairDisplay.variable} ${greatVibes.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
