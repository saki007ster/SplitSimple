'use client'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Group } from '@/generated/prisma/browser'
import { trpc } from '@/trpc/client'
import { Eye, Pencil, Share } from 'lucide-react'
import { useState } from 'react'

export function ShareButton({ group }: { group: Group }) {
  const [url, setUrl] = useState<string>()
  const [label, setLabel] = useState<string>()
  const createInvite = trpc.groups.invites.create.useMutation()
  const invitations = trpc.groups.invites.list.useQuery({ groupId: group.id })
  const revokeInvite = trpc.groups.invites.revoke.useMutation()
  const utils = trpc.useUtils()

  async function create(role: 'EDITOR' | 'VIEWER') {
    const result = await createInvite.mutateAsync({ groupId: group.id, role })
    setUrl(result.url)
    setLabel(role === 'EDITOR' ? 'Editor invitation' : 'Read-only invitation')
    await utils.groups.invites.list.invalidate({ groupId: group.id })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button title="Invite people" size="icon" className="flex-shrink-0">
          <Share className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(24rem,calc(100vw-2rem))] space-y-4"
      >
        <div>
          <p className="font-semibold">Invite to {group.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Links expire after seven days and work once.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            disabled={createInvite.isPending}
            onClick={() => create('EDITOR')}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editor link
          </Button>
          <Button
            variant="outline"
            disabled={createInvite.isPending}
            onClick={() => create('VIEWER')}
          >
            <Eye className="mr-2 h-4 w-4" />
            Read-only link
          </Button>
        </div>
        {url && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="flex gap-2">
              <Input value={url} readOnly />
              <CopyButton text={url} title="Copy invitation" />
            </div>
          </div>
        )}
        {createInvite.error && (
          <p className="text-sm text-destructive">
            {createInvite.error.message}
          </p>
        )}
        {(invitations.data?.invites.length ?? 0) > 0 && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-sm font-medium">Recent invitations</p>
            {invitations.data?.invites.slice(0, 5).map((invite) => {
              const active =
                !invite.acceptedAt &&
                !invite.revokedAt &&
                invite.expiresAt > new Date()
              return (
                <div
                  key={invite.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="min-w-0 truncate text-muted-foreground">
                    {invite.acceptedBy
                      ? `Accepted by ${invite.acceptedBy.name}`
                      : `${invite.role === 'EDITOR' ? 'Editor' : 'Read-only'} · ${
                          active
                            ? 'active'
                            : invite.revokedAt
                              ? 'revoked'
                              : 'expired'
                        }`}
                  </span>
                  {active && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={revokeInvite.isPending}
                      onClick={async () => {
                        await revokeInvite.mutateAsync({
                          groupId: group.id,
                          inviteId: invite.id,
                        })
                        await utils.groups.invites.list.invalidate({
                          groupId: group.id,
                        })
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
