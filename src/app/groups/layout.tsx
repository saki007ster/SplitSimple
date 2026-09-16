import { PropsWithChildren, Suspense } from 'react'

export default function GroupsLayout({ children }: PropsWithChildren<{}>) {
  return (
    <Suspense>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-9">
        {children}
      </main>
    </Suspense>
  )
}
