import { updateGroup } from '@/lib/api'
import { groupFormSchema } from '@/lib/schemas'
import { groupWriteProcedure } from '@/trpc/init'
import { z } from 'zod'

export const updateGroupProcedure = groupWriteProcedure
  .input(
    z.object({
      groupId: z.string().min(1),
      groupFormValues: groupFormSchema,
      participantId: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { groupId, groupFormValues, participantId } }) => {
    await updateGroup(groupId, groupFormValues, participantId)
  })
