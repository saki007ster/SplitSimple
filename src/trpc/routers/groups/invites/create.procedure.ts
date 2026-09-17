import { effectiveBaseUrl } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { randomId } from '@/lib/random'
import { groupOwnerProcedure } from '@/trpc/init'
import { createHash, randomBytes } from 'crypto'
import { z } from 'zod'

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const createInviteProcedure = groupOwnerProcedure
  .input(
    z.object({
      groupId: z.string().min(1),
      role: z.enum(['EDITOR', 'VIEWER']),
    }),
  )
  .mutation(async ({ input: { groupId, role }, ctx }) => {
    const token = randomBytes(32).toString('base64url')
    const invite = await prisma.groupInvite.create({
      data: {
        id: randomId(),
        tokenHash: hashToken(token),
        groupId,
        role,
        createdById: ctx.session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
    return {
      id: invite.id,
      url: `${effectiveBaseUrl}/invite/${token}`,
      expiresAt: invite.expiresAt,
    }
  })
