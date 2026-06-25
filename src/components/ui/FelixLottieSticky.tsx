import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function FelixLottieSticky() {
  const [stuck, setStuck] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(entry.isIntersecting)
      },
      { root: null, threshold: 0 },
    )
    const sentinel = sentinelRef.current
    if (sentinel) {
      observer.observe(sentinel)
    }
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [])

  return (
    <>
      <div
        className={cn(
          'right-0 bottom-0 pointer-events-none select-none w-[500px] h-[500px] transition-all duration-300',
          stuck ? 'absolute' : 'fixed z-20',
        )}
      >
        <DotLottieReact
          src='/animations/lottie/felix.lottie'
          autoplay
          loop={false}
          className='w-full h-full opacity-[0.12] dark:opacity-[0.08]'
        />
      </div>
      <div
        ref={sentinelRef}
        className='absolute bottom-[52px] w-full h-[1px] pointer-events-none'
      />
    </>
  )
}
