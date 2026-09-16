import { Button } from '@/components/ui/button'
import { TrackPage } from '@/lib/analytics/track-page'
import { ArrowRight, Check, ReceiptText, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

// FIX for https://github.com/vercel/next.js/issues/58615
// export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <TrackPage path="/" />
      <section className="relative px-4 pb-20 pt-14 sm:pb-28 sm:pt-20">
        <div className="pastel-blob pastel-blob-one" />
        <div className="pastel-blob pastel-blob-two" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="size-3.5" />
              Free, friendly expense splitting
            </div>
            <h1 className="text-balance text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
              Shared expenses,
              <span className="block text-primary">minus the awkwardness.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Add what you paid, choose who was involved, and SplitSimple does
              the maths. No spreadsheets. No daily limits. No drama.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/groups/create">
                  Start a group
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/groups">Open my groups</Link>
              </Button>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {['No account needed', 'Unlimited entries', 'Easy to share'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[#dbeee7]/70 blur-2xl" />
            <div className="rotate-[1.5deg] rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_28px_70px_-30px_rgba(45,77,67,.35)] backdrop-blur sm:p-7 dark:border-white/10 dark:bg-card/90">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
                    Weekend in Goa
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Everyone is almost even
                  </h2>
                </div>
                <div className="flex -space-x-2">
                  {['SK', 'AP', 'RM'].map((initials, index) => (
                    <span
                      key={initials}
                      className="grid size-9 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-slate-700"
                      style={{
                        backgroundColor: ['#f8d8c3', '#d9e8f7', '#e6dcf5'][
                          index
                        ],
                      }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#edf7f3] p-4 dark:bg-primary/10">
                  <p className="text-xs text-muted-foreground">You are owed</p>
                  <p className="mt-1 text-2xl font-bold text-primary">₹1,240</p>
                </div>
                <div className="rounded-2xl bg-[#fff2e9] p-4 dark:bg-orange-950/30">
                  <p className="text-xs text-muted-foreground">Group spend</p>
                  <p className="mt-1 text-2xl font-bold">₹8,460</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ['Villa', 'Paid by Aisha', '₹5,200', '🏡'],
                  ['Dinner', 'Paid by you', '₹2,140', '🍜'],
                  ['Cab', 'Paid by Rohan', '₹1,120', '🚕'],
                ].map(([title, detail, amount, emoji]) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl border bg-background/80 p-3.5"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary text-lg">
                      {emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {detail}
                      </span>
                    </span>
                    <span className="font-semibold">{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white/55 px-4 py-16 dark:bg-card/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <p className="text-sm font-semibold text-primary">
              Simple by design
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your group needs to settle up
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                Users,
                'Create your circle',
                'Start a group and invite friends with one private link.',
              ],
              [
                ReceiptText,
                'Add expenses fast',
                'Split equally or by exact amount, with receipts when you need them.',
              ],
              [
                Check,
                'Settle with confidence',
                'See clear balances and the simplest path to getting even.',
              ],
            ].map(([Icon, title, body]) => {
              const FeatureIcon = Icon as typeof Users
              return (
                <article
                  key={title as string}
                  className="rounded-3xl border bg-card p-6 shadow-sm"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                    <FeatureIcon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{title as string}</h3>
                  <p className="mt-2 leading-6 text-muted-foreground">
                    {body as string}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
