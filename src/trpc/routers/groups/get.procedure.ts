import { getGroup } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const getGroupProcedure = protectedProcedure
  .input(z.object({ groupId: z.string().min(1) }))
  .query(async ({ input: { groupId }, ctx }) => {
    const [membership, memberCount] = await Promise.all([
      prisma.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId: ctx.session.user.id } },
      }),
      prisma.groupMember.count({ where: { groupId } }),
    ])
    const claimable = memberCount === 0
    if (!membership && !claimable) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have access to this group.',
      })
    }
    const group = await getGroup(groupId)
    return { group, accessRole: membership?.role ?? null, claimable }
  })
