'use client'

import { GroupTabs } from '@/app/groups/[groupId]/group-tabs'
import { ShareButton } from '@/app/groups/[groupId]/share-button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useCurrentGroup } from './current-group-context'

export const GroupHeader = () => {
  const { isLoading, groupId, group, accessRole } = useCurrentGroup()

  return (
    <div className="flex flex-col justify-between gap-4 pt-1">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        <Link href={`/groups/${groupId}`}>
          {isLoading ? (
            <Skeleton className="mt-1.5 mb-1.5 h-5 w-32" />
          ) : (
            <div className="flex">{group.name}</div>
          )}
        </Link>
      </h1>

      <div className="flex items-center justify-between gap-2">
        <GroupTabs
          groupId={groupId}
          canEdit={accessRole === 'OWNER' || accessRole === 'EDITOR'}
        />
        {group && accessRole === 'OWNER' && <ShareButton group={group} />}
      </div>
    </div>
  )
}
