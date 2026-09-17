import { auth } from '@/lib/auth'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { GroupLayoutClient } from './layout.client'

type Props = {
  params: Promise<{
    groupId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params

  return {
    title: {
      default: 'Group',
      template: `%s · SplitSimple`,
    },
  }
}

export default async function GroupLayout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { groupId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session)
    redirect(`/auth?next=${encodeURIComponent(`/groups/${groupId}`)}`)
  return <GroupLayoutClient groupId={groupId}>{children}</GroupLayoutClient>
}
