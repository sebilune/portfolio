interface IntroProps {
  className?: string
}

export function Intro({ className }: IntroProps) {
  return (
    <p className={className}>
      <span className='font-bold tracking-wider font-newsreader'>
        Bringing ideas to life.
      </span>
      <span className='font-mono'>
        &nbsp;Software Engineer based in Florida, specialized in the development
        of modern websites, apps, tools, and everything in between.
      </span>
    </p>
  )
}
