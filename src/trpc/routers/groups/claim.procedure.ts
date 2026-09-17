import { randomId } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const claimGroupProcedure = protectedProcedure
  .input(z.object({ groupId: z.string().min(1).max(64) }))
  .mutation(async ({ input: { groupId }, ctx }) => {
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "Group" WHERE "id" = ${groupId} FOR UPDATE`
      const group = await tx.group.findUnique({
        where: { id: groupId },
        select: { _count: { select: { members: true } } },
      })
      if (!group) throw new TRPCError({ code: 'NOT_FOUND' })
      if (group._count.members !== 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This group has already been claimed.',
        })
      }
      return tx.groupMember.create({
        data: {
          id: randomId(),
          groupId,
          userId: ctx.session.user.id,
          role: 'OWNER',
        },
      })
    })
    return { role: result.role }
  })
