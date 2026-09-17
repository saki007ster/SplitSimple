import { CreateGroup } from '@/app/groups/create/create-group'
import { auth } from '@/lib/auth'
import { env } from '@/lib/env'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function generateMetadata() {
  const t = await getTranslations('Groups')

  return {
    title: t('createGroup'),
  }
}

export default async function CreateGroupPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth?next=/groups/create')
  const defaultCurrencyCode =
    env.DEFAULT_CURRENCY_CODE ?? env.NEXT_PUBLIC_DEFAULT_CURRENCY_CODE ?? 'USD'
  return <CreateGroup defaultCurrencyCode={defaultCurrencyCode} />
}
