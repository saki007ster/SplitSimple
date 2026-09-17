import { getGroups } from '@/lib/api'
import { MAX_GROUPS_PER_QUERY } from '@/lib/group-query-limits'
import { prisma } from '@/lib/prisma'
import { protectedProcedure } from '@/trpc/init'
import { z } from 'zod'

export const listGroupsProcedure = protectedProcedure
  .input(
    z.object({
      groupIds: z.array(z.string().min(1).max(64)).max(MAX_GROUPS_PER_QUERY),
    }),
  )
  .query(async ({ input: { groupIds: legacyCandidateIds }, ctx }) => {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: ctx.session.user.id },
      select: { groupId: true },
      orderBy: { createdAt: 'desc' },
      take: MAX_GROUPS_PER_QUERY,
    })
    const legacyGroups = await prisma.group.findMany({
      where: {
        id: { in: legacyCandidateIds },
        members: { none: {} },
      },
      select: { id: true },
      take: MAX_GROUPS_PER_QUERY,
    })
    const groupIds = [
      ...memberships.map(({ groupId }) => groupId),
      ...legacyGroups.map(({ id }) => id),
    ].slice(0, MAX_GROUPS_PER_QUERY)
    const groups = await getGroups(groupIds)
    const byId = new Map(groups.map((group) => [group.id, group]))
    return {
      groups: groupIds.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])),
    }
  })
