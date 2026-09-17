'use client'

import { ErrorState } from '@/components/error-state'
import * as Sentry from '@sentry/nextjs'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

export default function Error({
  error,
  retry,
}: {
  error: unknown
  reset: () => void
  retry: () => void
}) {
  const t = useTranslations('Errors')
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])
  return (
    <ErrorState
      error={error}
      retry={retry}
      title={t('title')}
      className="container max-w-lg py-16"
    />
  )
}
