import { prisma } from '@/lib/prisma'
import { randomId } from '@/lib/random'
import { protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { createHash } from 'crypto'
import { z } from 'zod'

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const acceptInviteProcedure = protectedProcedure
  .input(z.object({ token: z.string().min(20).max(200) }))
  .mutation(async ({ input: { token }, ctx }) => {
    const invite = await prisma.groupInvite.findUnique({
      where: { tokenHash: hashToken(token) },
    })
    if (
      !invite ||
      invite.revokedAt ||
      invite.acceptedAt ||
      invite.expiresAt <= new Date()
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This invitation is invalid or has expired.',
      })
    }
    await prisma.$transaction(async (tx) => {
      const accepted = await tx.groupInvite.updateMany({
        where: {
          id: invite.id,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { acceptedAt: new Date(), acceptedById: ctx.session.user.id },
      })
      if (accepted.count !== 1) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'This invitation has already been used.',
        })
      }
      await tx.groupMember.upsert({
        where: {
          groupId_userId: {
            groupId: invite.groupId,
            userId: ctx.session.user.id,
          },
        },
        create: {
          id: randomId(),
          groupId: invite.groupId,
          userId: ctx.session.user.id,
          role: invite.role,
        },
        update: {},
      })
    })
    return { groupId: invite.groupId }
  })
