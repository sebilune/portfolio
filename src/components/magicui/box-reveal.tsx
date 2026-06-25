import { motion, useAnimation, useInView } from 'motion/react'
import { useEffect, useRef, useState, type JSX } from 'react'

interface BoxRevealProps {
  children: JSX.Element
  width?: 'fit-content' | '100%'
  boxColor?: string
  boxDuration?: number
  delay?: number
}

export const BoxReveal = ({
  children,
  width = 'fit-content',
  boxColor = '#5046e6',
  boxDuration = 0.5,
  delay = 0,
}: BoxRevealProps) => {
  const mainControls = useAnimation()
  const slideControls = useAnimation()

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible')
      mainControls.start('visible')
    }
  }, [isInView, mainControls, slideControls])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width,
        display: 'inline-block',
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{
          duration: 0.5,
          delay,
        }}
        style={{ pointerEvents: 'auto', zIndex: 30 }}
        className='group'
      >
        {children}
      </motion.div>

      {!isRevealed && (
        <motion.div
          variants={{
            hidden: { left: 0 },
            visible: { left: '100%' },
          }}
          initial='hidden'
          animate={slideControls}
          onAnimationComplete={() => setIsRevealed(true)}
          transition={{
            duration: boxDuration,
            ease: 'easeIn',
            delay,
          }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: boxColor,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
