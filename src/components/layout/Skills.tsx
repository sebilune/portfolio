import { OrbitingCircles } from '@/components/magicui/orbiting-circles'

const logos = [
  { name: 'linux', scale: 1.2 },
  { name: 'visualstudiocode', scale: 0.95 },
  { name: 'python', scale: 1.0 },
  { name: 'node', scale: 1.0 },
  { name: 'git', scale: 0.9 },
  { name: 'sass', scale: 1.1 },
  { name: 'docker', scale: 1.4 },
  { name: 'bash', scale: 1.2 },
  { name: 'next', scale: 1 },
  { name: 'go', scale: 1.1 },
  { name: 'cloudflare', scale: 1.2 },
  { name: 'vim', scale: 0.95 },
  { name: 'react', scale: 1.0 },
  { name: 'typescript', scale: 0.85 },
  { name: 'postgres', scale: 1.1 },
  { name: 'hono', scale: 1.0 },
  { name: 'tailwindcss', scale: 1.0 },
  { name: 'bun', scale: 1.0 },
  { name: 'vitejs', scale: 1.0 },
]

export function Skills() {
  const outerCount = Math.ceil(logos.length * 0.65) // 65% of logos in outer circle
  const outer = logos.slice(0, outerCount)
  const inner = logos.slice(outerCount)

  return (
    <div>
      <div className='relative flex h-75 w-75 flex-col items-center justify-center overflow-hidden'>
        <OrbitingCircles iconSize={34} radius={120} speed={0.5}>
          {outer.map(({ name, scale = 1.0 }) => (
            <img
              key={name}
              src={`/svg/logos/${name}.svg`}
              alt={`${name} logo`}
              className='w-full h-full object-contain'
              style={{ transform: `scale(${scale})` }}
            />
          ))}
        </OrbitingCircles>
        <OrbitingCircles iconSize={34} radius={60} reverse speed={0.4}>
          {inner.map(({ name, scale = 1.0 }) => (
            <img
              key={name}
              src={`/svg/logos/${name}.svg`}
              alt={`${name} logo`}
              className='w-full h-full object-contain'
              style={{ transform: `scale(${scale})` }}
            />
          ))}
        </OrbitingCircles>
      </div>
    </div>
  )
}
