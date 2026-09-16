import { saveRecentGroup } from '@/app/groups/recent-groups-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMediaQuery } from '@/lib/hooks'
import { trpc } from '@/trpc/client'
import { Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  reload: () => void
}

export function AddGroupByUrlButton({ reload }: Props) {
  const t = useTranslations('Groups.AddByURL')
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const utils = trpc.useUtils()

  const processUrl = async (urlToProcess: string) => {
    // Parse with the URL API rather than building a RegExp from
    // window.location.origin, which is a regex-injection sink. Resolving
    // against the current origin also lets a scanned QR carry a relative
    // /groups/<id> link, while an absolute link keeps its own origin and so
    // still fails the same-origin check below.
    let groupId: string | undefined
    try {
      const parsed = new URL(urlToProcess, window.location.origin)
      if (parsed.origin === window.location.origin) {
        groupId = parsed.pathname.match(/^\/groups\/([^/]+)/)?.[1]
      }
    } catch {
      // Unparseable input is treated as "not found" below.
    }

    if (!groupId) {
      setError(true)
      setPending(false)
      return
    }

    setPending(true)
    try {
      const { group } = await utils.groups.get.fetch({
        groupId: groupId,
      })
      if (group) {
        saveRecentGroup({ id: group.id, name: group.name })
        reload()
        setUrl('')
        setOpen(false)
        setError(false)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary">{t('button')}</Button>
      </PopoverTrigger>
      <PopoverContent
        align={isDesktop ? 'end' : 'start'}
        className="[&_p]:text-sm flex flex-col gap-3"
      >
        <h3 className="font-bold">{t('title')}</h3>
        <p>{t('description')}</p>

        <form
          className="flex gap-2 flex-wrap"
          onSubmit={async (event) => {
            event.preventDefault()
            await processUrl(url)
          }}
        >
          <Input
            type="url"
            required
            placeholder="https://splitsimple.app/groups/..."
            className="flex-1 min-w-[200px] text-base"
            value={url}
            disabled={pending}
            onChange={(event) => {
              setUrl(event.target.value)
              setError(false)
            }}
          />
          <Button
            size="icon"
            type="submit"
            disabled={pending}
            className="flex-shrink-0"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </form>

        {error && <p className="text-destructive">{t('error')}</p>}
      </PopoverContent>
    </Popover>
  )
}
