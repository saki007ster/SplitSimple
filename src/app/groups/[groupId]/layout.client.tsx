'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { trpc } from '@/trpc/client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'
import { CurrentGroupProvider } from './current-group-context'
import { GroupHeader } from './group-header'
import { SaveGroupLocally } from './save-recent-group'

export function GroupLayoutClient({
  groupId,
  children,
}: PropsWithChildren<{ groupId: string }>) {
  const { data, isLoading, isError, error } = trpc.groups.get.useQuery({
    groupId,
  })
  const t = useTranslations('Groups.NotFound')
  const { toast } = useToast()
  const claim = trpc.groups.claim.useMutation()
  const utils = trpc.useUtils()
  const pathname = usePathname()

  useEffect(() => {
    if (data && !data.group) {
      toast({
        description: t('text'),
        variant: 'destructive',
      })
    }
  }, [data, t, toast])

  if (data?.claimable && data.group) {
    return (
      <Card className="mx-auto mt-12 max-w-lg rounded-3xl">
        <CardHeader>
          <CardTitle>Secure this existing group</CardTitle>
          <CardDescription>
            This group was created before accounts were enabled. Claim it to
            become its owner and prevent anyone with the old link from editing
            it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">{data.group.name}</p>
          <Button
            disabled={claim.isPending}
            onClick={async () => {
              await claim.mutateAsync({ groupId })
              await utils.groups.invalidate()
            }}
          >
            {claim.isPending ? 'Securing…' : 'Claim and secure group'}
          </Button>
          {claim.error && (
            <p className="text-sm text-destructive">{claim.error.message}</p>
          )}
          <Button asChild variant="ghost">
            <Link href="/groups">Back to groups</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isError || (!isLoading && !data?.group)) {
    return (
      <Card className="mx-auto mt-12 max-w-lg rounded-3xl">
        <CardHeader>
          <CardTitle>Group unavailable</CardTitle>
          <CardDescription>
            {error?.message ??
              'This group does not exist or you no longer have access.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/groups">Back to your groups</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const editorOnlyPath =
    /\/groups\/[^/]+\/edit$/.test(pathname) ||
    /\/groups\/[^/]+\/expenses\/(create|[^/]+\/edit)$/.test(pathname)
  if (data?.accessRole === 'VIEWER' && editorOnlyPath) {
    return (
      <Card className="mx-auto mt-12 max-w-lg rounded-3xl">
        <CardHeader>
          <CardTitle>Read-only access</CardTitle>
          <CardDescription>
            You can view this group, its expenses, and balances, but only an
            editor or owner can make changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/groups/${groupId}/expenses`}>View expenses</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const props =
    isLoading || !data?.group
      ? {
          isLoading: true as const,
          groupId,
          group: undefined,
          accessRole: undefined,
        }
      : {
          isLoading: false as const,
          groupId,
          group: data.group,
          accessRole: data.accessRole!,
        }

  if (isLoading) {
    return (
      <CurrentGroupProvider {...props}>
        <GroupHeader />
        {children}
      </CurrentGroupProvider>
    )
  }

  return (
    <CurrentGroupProvider {...props}>
      <GroupHeader />
      {children}
      <SaveGroupLocally />
    </CurrentGroupProvider>
  )
}
