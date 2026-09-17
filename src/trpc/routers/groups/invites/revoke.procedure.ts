import { prisma } from '@/lib/prisma'
import { groupOwnerProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const revokeInviteProcedure = groupOwnerProcedure
  .input(z.object({ groupId: z.string().min(1), inviteId: z.string().min(1) }))
  .mutation(async ({ input: { groupId, inviteId } }) => {
    const result = await prisma.groupInvite.updateMany({
      where: { id: inviteId, groupId, acceptedAt: null },
      data: { revokedAt: new Date() },
    })
    if (!result.count)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found.',
      })
    return { success: true }
  })
