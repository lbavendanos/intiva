import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { url } from '@/lib/utils'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateMetadata(): Metadata {
  const appName = process.env.APP_NAME as string
  const appLocale = process.env.APP_LOCALE
  const description = `${appName} es una boutique de moda en línea de Perú para mujer. Encuentra calzado, ropa y accesorios de marcas exclusivas y modelos de edición limitada.`

  return {
    metadataBase: url(),
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    description,
    openGraph: {
      title: {
        default: appName,
        template: `%s | ${appName}`,
      },
      description,
      url: url(),
      siteName: appName,
      locale: appLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        default: appName,
        template: `%s | ${appName}`,
      },
      description,
      // siteId: '1467726470533754880',
      creator: '@intiva',
      // creatorId: '1467726470533754880',
      // images: ['https://nextjs.org/og.png'], // Must be an absolute URL
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const appLocale = process.env.APP_LOCALE

  return (
    <html lang={appLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
