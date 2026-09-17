import { updateExpense } from '@/lib/api'
import { expenseFormSchema } from '@/lib/schemas'
import { groupWriteProcedure } from '@/trpc/init'
import { z } from 'zod'

export const updateGroupExpenseProcedure = groupWriteProcedure
  .input(
    z.object({
      expenseId: z.string().min(1),
      groupId: z.string().min(1),
      expenseFormValues: expenseFormSchema,
      participantId: z.string().optional(),
    }),
  )
  .mutation(
    async ({
      input: { expenseId, groupId, expenseFormValues, participantId },
    }) => {
      const expense = await updateExpense(
        groupId,
        expenseId,
        expenseFormValues,
        participantId,
      )
      return { expenseId: expense.id }
    },
  )
