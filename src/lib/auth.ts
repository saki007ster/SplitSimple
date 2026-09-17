import { prisma } from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const developmentSecret =
  'development-only-secret-change-before-production-0000000000'
if (process.env.NODE_ENV === 'production' && !process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is required in production')
}

export const auth = betterAuth({
  appName: 'SplitSimple',
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET ?? developmentSecret,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60, strategy: 'jwe' },
  },
  rateLimit: {
    enabled: process.env.E2E_DISABLE_AUTH_RATE_LIMIT !== 'true',
    storage: 'database',
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 60, max: 10 },
      '/sign-up/email': { window: 60 * 10, max: 5 },
      '/delete-user': { window: 60 * 60, max: 3 },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        // An account owner owns the lifecycle of groups they created/claimed.
        // Delete those groups first; all expenses and invitations cascade.
        await prisma.group.deleteMany({
          where: {
            members: { some: { userId: user.id, role: 'OWNER' } },
          },
        })
      },
    },
  },
  advanced: { database: { joins: true } },
})

export type AuthSession = typeof auth.$Infer.Session
