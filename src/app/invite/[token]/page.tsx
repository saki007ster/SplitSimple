import { AcceptInvite } from './accept-invite'

export const metadata = { title: 'Group invitation' }

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
      <AcceptInvite token={token} />
    </main>
  )
}
