import { cn } from '@/lib/utils'

type BrandLogoProps = {
  className?: string
  compact?: boolean
}

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-primary shadow-[0_8px_20px_-10px_hsl(var(--primary))]"
      >
        <span className="absolute left-[8px] top-[9px] h-4 w-4 rounded-[6px] bg-white/95" />
        <span className="absolute bottom-[8px] right-[7px] h-4 w-4 rounded-[6px] border-[3px] border-primary bg-[#f7d6bf]" />
      </span>
      {!compact && (
        <span className="text-[1.05rem] font-bold tracking-[-0.035em] text-foreground">
          Split<span className="text-primary">Simple</span>
        </span>
      )}
      <span className="sr-only">SplitSimple</span>
    </span>
  )
}
