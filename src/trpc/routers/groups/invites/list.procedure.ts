import { prisma } from '@/lib/prisma'
import { groupOwnerProcedure } from '@/trpc/init'
import { z } from 'zod'

export const listInvitesProcedure = groupOwnerProcedure
  .input(z.object({ groupId: z.string().min(1) }))
  .query(async ({ input: { groupId } }) => ({
    invites: await prisma.groupInvite.findMany({
      where: { groupId },
      select: {
        id: true,
        role: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        acceptedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  }))
