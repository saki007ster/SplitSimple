import { GroupRole } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

const roleRank: Record<GroupRole, number> = {
  VIEWER: 0,
  EDITOR: 1,
  OWNER: 2,
}

export async function requireGroupRole(
  userId: string,
  groupId: string,
  minimum: GroupRole = GroupRole.VIEWER,
) {
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  })

  if (!membership || roleRank[membership.role] < roleRank[minimum]) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        minimum === GroupRole.VIEWER
          ? 'You do not have access to this group.'
          : 'You only have read-only access to this group.',
    })
  }
  return membership
}

export async function isLegacyGroupClaimable(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { _count: { select: { members: true } } },
  })
  return group?._count.members === 0
}
