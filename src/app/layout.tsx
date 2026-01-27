import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { url } from '@/lib/utils'
import { getCart } from '@/actions/cart'
import { Header } from '@/components/layout/header'
import { CartProvider } from '@/components/shop/cart-provider'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateMetadata(): Metadata {
  const appName = process.env.NEXT_PUBLIC_APP_NAME as string
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
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
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const cartPromise = getCart()

  return (
    <html lang={appLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <CartProvider cartPromise={cartPromise}>
            <Header />
            <main className="flex-1">{children}</main>
          </CartProvider>
        </div>
      </body>
    </html>
  )
}
