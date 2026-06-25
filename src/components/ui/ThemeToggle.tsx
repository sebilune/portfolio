import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type='button'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='relative flex items-center justify-center w-10 h-10 bg-transparent border-none rounded-full cursor-pointer group focus:outline-none'
      aria-label='Toggle theme'
    >
      <Sun className='w-6 h-6 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 group-hover:scale-0 group-hover:-rotate-90 group-hover:dark:scale-100 group-hover:dark:rotate-0' />
      <Moon className='absolute w-6 h-6 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 group-hover:scale-100 group-hover:rotate-0 group-hover:dark:scale-0 group-hover:dark:-rotate-90' />
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}
