import { AccountSettings } from './settings'

export const metadata = { title: 'Account' }

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <AccountSettings />
    </main>
  )
}
