import { BoxReveal } from '@/components/magicui/box-reveal'
import { Code } from 'lucide-react'
import { Link, type LinkColor } from '@/components/ui/Link'

interface Project {
  name: string
  desc: string
  link: string
  code: string
  color: LinkColor
  boxColor: string
  delay?: number
}

const projects: Project[] = [
  {
    name: 'Todo',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://github.com/sebilune',
    code: 'https://github.com/sebilune',
    color: 'lime',
    boxColor: '#9ae600',
    delay: 0.2,
  },
  {
    name: 'Todo',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://github.com/sebilune',
    code: 'https://github.com/sebilune',
    color: 'pink',
    boxColor: '#fb64b6',
    delay: 0.4,
  },
]

export function Projects() {
  return (
    <div className='flex flex-col flex-1 max-w-md gap-6'>
      <h2 className='text-neutral-500 dark:text-neutral-400 font-semibold'>
        Projects
      </h2>
      {projects.map((project) => (
        <div key={project.name}>
          <h3 className='mb-1 font-semibold tracking-wider'>
            <BoxReveal boxColor={project.boxColor} delay={project.delay}>
              <div className='inline-flex items-center'>
                <Link color={project.color} link={project.link}>
                  {project.name}
                </Link>
                <a
                  href={project.code}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center ml-2 text-zinc-500 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-200 transition-colors duration-200'
                  aria-label={`View source code for ${project.name}`}
                >
                  <Code size={20} />
                </a>
              </div>
            </BoxReveal>
          </h3>
          <p className='font-mono text-neutral-500 dark:text-neutral-400'>
            {project.desc}
          </p>
        </div>
      ))}
    </div>
  )
}
