import { RecentGroupList } from '@/app/groups/recent-group-list'
import { TrackPage } from '@/lib/analytics/track-page'
import { auth } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function generateMetadata() {
  const t = await getTranslations('Groups')

  return {
    title: t('recent'),
  }
}

export default async function GroupsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth?next=/groups')
  return (
    <>
      <TrackPage path="/groups" />
      <RecentGroupList />
    </>
  )
}
