import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LinkColor = 'pink' | 'lime' | 'cyan' | 'purple' | 'orange'

// Static map to ensure Tailwind bundles the colors properly
const colorMap: Record<LinkColor, { text: string; decoration: string }> = {
  pink: { text: 'text-pink-400', decoration: 'decoration-pink-400' },
  lime: { text: 'text-lime-400', decoration: 'decoration-lime-400' },
  cyan: { text: 'text-cyan-400', decoration: 'decoration-cyan-400' },
  purple: { text: 'text-purple-400', decoration: 'decoration-purple-400' },
  orange: { text: 'text-orange-400', decoration: 'decoration-orange-400' },
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  color: LinkColor
  link: string
}

export function Link({
  children,
  color,
  link,
  className,
  ...props
}: LinkProps) {
  const styles = colorMap[color]
  const isMail = link.startsWith('mailto:')

  return (
    <a
      href={link}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      className={cn(
        'inline-flex items-center group/link focus:outline-none',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'tracking-wider underline transition-all duration-200 decoration-2 underline-offset-4',
          'group-hover/link:decoration-[3px]', // Pure CSS hover style
          styles.decoration,
        )}
      >
        {children}
      </span>
      <ArrowUpRight
        size={20}
        className={cn(
          'ml-0.5 transition-transform duration-200',
          'group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5', // Subtle micro-animation
          styles.text,
        )}
      />
    </a>
  )
}
