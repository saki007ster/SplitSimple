'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AccountSettings() {
  const { data: session, isPending } = authClient.useSession()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  if (isPending) return <p>Loading…</p>
  if (!session)
    return (
      <p>
        Please{' '}
        <Link className="underline" href="/auth?next=/account">
          sign in
        </Link>{' '}
        to manage your account.
      </p>
    )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="mt-2 text-muted-foreground">{session.user.email}</p>
      </div>
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Delete account and data</CardTitle>
          <CardDescription>
            This permanently deletes your account and every group you own,
            including expenses, activities, and invitations. This cannot be
            undone. Content in groups owned by someone else remains shared group
            data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Confirm your password</Label>
            <Input
              id="delete-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            variant="destructive"
            disabled={deleting || !password}
            onClick={async () => {
              if (
                !window.confirm(
                  'Permanently delete your account and all groups you own?',
                )
              )
                return
              setDeleting(true)
              setError(undefined)
              const result = await authClient.deleteUser({ password })
              if (result.error) {
                setError(result.error.message ?? 'Account deletion failed.')
                setDeleting(false)
                return
              }
              router.push('/')
              router.refresh()
            }}
          >
            {deleting ? 'Deleting…' : 'Permanently delete account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
