import { ApplePwaSplash } from '@/app/apple-pwa-splash'
import { AuthMenu } from '@/components/auth-menu'
import { BrandLogo } from '@/components/brand-logo'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ProgressBar } from '@/components/progress-bar'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@/lib/analytics/analytics'
import { getAnalyticsConfig } from '@/lib/analytics/config'
import { effectiveBaseUrl } from '@/lib/env'
import { TRPCProvider } from '@/trpc/client'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, useTranslations } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Suspense } from 'react'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Homepage')
  return {
    metadataBase: new URL(effectiveBaseUrl),
    title: {
      default: t('metaTitle'),
      template: '%s · SplitSimple',
    },
    description:
      'Split expenses with friends and family—simply, fairly, and without daily limits.',
    openGraph: {
      title: t('metaTitle'),
      description:
        'Split expenses with friends and family—simply, fairly, and without daily limits.',
      type: 'website',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description:
        'Split expenses with friends and family—simply, fairly, and without daily limits.',
    },
    appleWebApp: {
      capable: true,
      title: 'SplitSimple',
    },
    applicationName: 'SplitSimple',
    icons: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
  }
}

export const viewport: Viewport = {
  themeColor: '#4d7d6b',
}

function Content({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  return (
    <TRPCProvider>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border/70 bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            className="rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <BrandLogo />
          </Link>
          <div role="navigation" aria-label="Menu" className="flex">
            <ul className="flex items-center text-sm">
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary"
                >
                  <Link href="/groups">{t('Header.groups')}</Link>
                </Button>
              </li>
              <li>
                <LocaleSwitcher />
              </li>
              <li>
                <ThemeToggle />
              </li>
              <li>
                <AuthMenu />
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="pt-16 flex-1 flex flex-col">{children}</div>

      <footer className="mt-12 border-t bg-card/45 px-4 py-8 text-sm text-muted-foreground sm:mt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link href="/" aria-label="SplitSimple home">
            <BrandLogo />
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <p>Made for shared moments, not shared spreadsheets.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </TRPCProvider>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const analyticsConfig = await getAnalyticsConfig()
  return (
    <html
      lang={locale}
      dir={['ar', 'he'].includes(locale) ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <ApplePwaSplash icon="/logo.svg" color="#4d7d6b" />
      <body className="min-h-[100dvh] flex flex-col items-stretch">
        <NextIntlClientProvider messages={messages}>
          {/* Rendered inside the provider because it reads translations via
              `useTranslations`, which needs NextIntlClientProvider in its
              ancestor tree. */}
          <ServiceWorkerRegistration />
          <Analytics config={analyticsConfig}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Suspense>
                <ProgressBar />
              </Suspense>
              <Content>{children}</Content>
            </ThemeProvider>
          </Analytics>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
