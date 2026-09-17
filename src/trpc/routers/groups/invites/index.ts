import { createTRPCRouter } from '@/trpc/init'
import { acceptInviteProcedure } from './accept.procedure'
import { createInviteProcedure } from './create.procedure'
import { listInvitesProcedure } from './list.procedure'
import { revokeInviteProcedure } from './revoke.procedure'

export const groupInvitesRouter = createTRPCRouter({
  accept: acceptInviteProcedure,
  create: createInviteProcedure,
  list: listInvitesProcedure,
  revoke: revokeInviteProcedure,
})
