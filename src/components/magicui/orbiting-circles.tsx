import { cn } from '@/lib/utils'
import React from 'react'

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center pointer-events-none',
        className,
      )}
      {...props}
    >
      {path && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          className='absolute pointer-events-none size-full'
        >
          <circle
            className='stroke-1 stroke-black/10 dark:stroke-white/10'
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index
        return (
          <div
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                '--icon-size': `${iconSize}px`,
                width: iconSize,
                height: iconSize,
              } as React.CSSProperties
            }
            className={cn(
              `absolute flex transform-gpu animate-orbit items-center justify-center rounded-full pointer-events-auto`,
              { '[animation-direction:reverse]': reverse },
            )}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
