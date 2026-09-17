import { GroupRole, Prisma } from '@/generated/prisma/client'
import { requireGroupRole } from '@/lib/access'
import { auth } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit'
import { initTRPC, TRPCError } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import superjson from 'superjson'

superjson.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: (v): v is Prisma.Decimal => Prisma.Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Prisma.Decimal(v),
  },
  'decimal.js',
)

export const createTRPCContext = async ({
  req,
}: FetchCreateContextFnOptions) => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await auth.api.getSession({ headers: req.headers })
  const forwardedFor = req.headers.get('x-forwarded-for')
  const ip =
    forwardedFor?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  return { session, ip }
}

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  })

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const baseProcedure = t.procedure

const authenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in.' })
  }
  await enforceRateLimit(`api:${ctx.session.user.id}`)
  return next({ ctx: { ...ctx, session: ctx.session } })
})

export const protectedProcedure = t.procedure.use(authenticated)

const groupAccess = (minimum: GroupRole) =>
  t.middleware(async ({ ctx, getRawInput, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in.' })
    }
    const input = await getRawInput()
    const groupId =
      input && typeof input === 'object' && 'groupId' in input
        ? (input as { groupId?: unknown }).groupId
        : undefined
    if (typeof groupId !== 'string') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Group ID is required.',
      })
    }
    const membership = await requireGroupRole(
      ctx.session.user.id,
      groupId,
      minimum,
    )
    return next({ ctx: { ...ctx, session: ctx.session, membership } })
  })

export const groupReadProcedure = protectedProcedure.use(
  groupAccess(GroupRole.VIEWER),
)
export const groupWriteProcedure = protectedProcedure.use(
  groupAccess(GroupRole.EDITOR),
)
export const groupOwnerProcedure = protectedProcedure.use(
  groupAccess(GroupRole.OWNER),
)
