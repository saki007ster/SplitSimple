import { AuthForm } from './auth-form'

export const metadata = { title: 'Sign in' }

export default function AuthPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
      <AuthForm />
    </main>
  )
}
