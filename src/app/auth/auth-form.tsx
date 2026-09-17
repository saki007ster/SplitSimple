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
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function AuthForm() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const router = useRouter()
  const search = useSearchParams()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(undefined)
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const callbackURL = search.get('next')?.startsWith('/')
      ? search.get('next')!
      : '/groups'

    const result =
      mode === 'sign-up'
        ? await authClient.signUp.email({
            email,
            password,
            name: String(data.get('name') ?? '').trim(),
            callbackURL,
          })
        : await authClient.signIn.email({ email, password, callbackURL })

    if (result.error) {
      setError(result.error.message ?? 'Unable to continue. Please try again.')
      setPending(false)
      return
    }
    router.push(callbackURL)
    router.refresh()
  }

  return (
    <Card className="w-full rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </CardTitle>
        <CardDescription>
          {mode === 'sign-in'
            ? 'Sign in to open the groups shared with you.'
            : 'Your account keeps group links private and permissions enforceable.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'sign-up' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                minLength={2}
                maxLength={80}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={10}
              maxLength={128}
              required
              autoComplete={
                mode === 'sign-in' ? 'current-password' : 'new-password'
              }
            />
            {mode === 'sign-up' && (
              <p className="text-xs text-muted-foreground">
                Use at least 10 characters.
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button className="w-full" disabled={pending} type="submit">
            {pending
              ? 'Please wait…'
              : mode === 'sign-in'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>
        <Button
          type="button"
          variant="link"
          className="mt-3 w-full"
          onClick={() => {
            setError(undefined)
            setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
          }}
        >
          {mode === 'sign-in'
            ? 'New here? Create an account'
            : 'Already have an account? Sign in'}
        </Button>
      </CardContent>
    </Card>
  )
}
