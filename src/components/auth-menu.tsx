'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AuthMenu() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) return <div className="h-9 w-20" aria-hidden />
  if (!session) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/auth">Sign in</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Button asChild size="sm" variant="ghost" className="max-w-32 truncate">
        <Link href="/account" aria-label="Account settings">
          <UserRound className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{session.user.name}</span>
        </Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={async () => {
          await authClient.signOut()
          router.push('/')
          router.refresh()
        }}
      >
        <LogOut className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  )
}
