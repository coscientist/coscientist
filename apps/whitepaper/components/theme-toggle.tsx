'use client'

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant='ghost' size='icon' className='rounded-full'>
            <HugeiconsIcon
              icon={Sun03Icon}
              className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
            />
            <HugeiconsIcon
              icon={Moon02Icon}
              className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
            />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        }
      />
      <MenuPopup align='end'>
        <MenuItem onClick={() => setTheme('light')}>Light</MenuItem>
        <MenuItem onClick={() => setTheme('dark')}>Dark</MenuItem>
        <MenuItem onClick={() => setTheme('system')}>System</MenuItem>
      </MenuPopup>
    </Menu>
  )
}
