import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'

export async function enforceRateLimit(
  key: string,
  { limit = 180, windowMs = 60_000 } = {},
) {
  // Performance runs make hundreds of repeated requests by design. Keeping
  // their query budgets focused on product queries also prevents the harness
  // from rate-limiting itself. No production deployment sets this variable.
  if (process.env.PERF_INSTRUMENTATION === '1') return

  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)
  const [bucket] = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "AppRateLimit" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${resetAt}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "AppRateLimit"."resetAt" <= ${now} THEN 1
        ELSE "AppRateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "AppRateLimit"."resetAt" <= ${now} THEN ${resetAt}
        ELSE "AppRateLimit"."resetAt"
      END,
      "updatedAt" = ${now}
    RETURNING "count"
  `

  if (bucket && bucket.count > limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please wait a moment and try again.',
    })
  }
}
