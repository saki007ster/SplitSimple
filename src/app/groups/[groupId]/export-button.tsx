'use client'

import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/lib/analytics/context'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ExportButton({ groupId }: { groupId: string }) {
  const t = useTranslations('Expenses')
  const sendEvent = useAnalytics()
  const trackExport = () =>
    sendEvent(
      { event: 'group: export expenses', props: { format: 'csv' } },
      `/groups/${groupId}/expenses`,
    )
  return (
    <Button asChild title={t('exportCsv')} variant="secondary" size="icon">
      <Link
        prefetch={false}
        href={`/groups/${groupId}/expenses/export/csv`}
        target="_blank"
        onClick={trackExport}
      >
        <Download className="size-4" />
      </Link>
    </Button>
  )
}
