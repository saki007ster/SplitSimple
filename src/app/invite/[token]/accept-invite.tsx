'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AcceptInvite({ token }: { token: string }) {
  const { data: session, isPending } = authClient.useSession()
  const invite = trpc.groups.invites.accept.useMutation()
  const [error, setError] = useState<string>()
  const router = useRouter()
  const next = `/invite/${encodeURIComponent(token)}`

  return (
    <Card className="w-full rounded-3xl">
      <CardHeader>
        <CardTitle>You’re invited</CardTitle>
        <CardDescription>
          Accept this invitation to add the SplitSimple group to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p>Checking your account…</p>
        ) : !session ? (
          <Button asChild className="w-full">
            <Link href={`/auth?next=${encodeURIComponent(next)}`}>
              Sign in to accept
            </Link>
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={invite.isPending}
            onClick={async () => {
              try {
                const { groupId } = await invite.mutateAsync({ token })
                router.push(`/groups/${groupId}`)
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : 'Could not accept this invitation.',
                )
              }
            }}
          >
            {invite.isPending ? 'Accepting…' : 'Accept invitation'}
          </Button>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
