import { Link } from '@/components/ui/Link'
import { BoxReveal } from '@/components/magicui/box-reveal'

export function Contact() {
  return (
    <div className='font-mono'>
      <BoxReveal boxColor='#c27aff'>
        <Link color='purple' link='mailto:sebilune@proton.me'>
          sebilune@proton.me
        </Link>
      </BoxReveal>
    </div>
  )
}
