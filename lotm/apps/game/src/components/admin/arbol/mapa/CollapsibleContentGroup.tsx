'use client'
import { ChevronRight } from 'lucide-react'

export function CollapsibleContentGroup({
  id,
  title,
  description,
  count,
  collapsed,
  onToggle,
  children,
}: {
  id: string
  title: string
  description: string
  count: number
  collapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="overflow-hidden rounded-lg border border-line bg-black/15">
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-brass/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass"
      >
        <span className="min-w-0 flex-1">
          <span id={`${id}-title`} className="block text-sm font-medium text-parchment">
            {title}
          </span>
          <span className="mt-0.5 block text-pretty text-[11px] leading-4 text-fog">
            {description}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-line2 px-2 py-0.5 text-xs tabular-nums text-fog">
          {count}
        </span>
        <ChevronRight
          aria-hidden="true"
          className={`mt-0.5 h-4 w-4 shrink-0 text-brass transition-transform ${
            collapsed ? '' : 'rotate-90'
          }`}
        />
      </button>
      <div id={`${id}-content`} hidden={collapsed} className="border-t border-line p-3">
        {children}
      </div>
    </section>
  )
}
