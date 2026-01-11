'use client'

import { Button, type buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Refresh01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { VariantProps } from 'class-variance-authority'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const RefreshButton = () => {
  const isClient = typeof window !== 'undefined'
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isClient) return
    setIsSpinning(isRefreshing)
    setShowCheckmark(false)
  }, [isRefreshing, isClient])

  useEffect(() => {
    if (!isClient || isRefreshing) return

    setShowCheckmark(true)
    const timeoutId = setTimeout(() => {
      setShowCheckmark(false)
      setIsSpinning(false)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [isRefreshing, isClient])

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true)
      // Simulate refresh with a 2-second delay
      setTimeout(() => {
        setIsRefreshing(false)
        toast.success('Refreshed successfully!')
      }, 2000)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant='outline'
              disabled={isRefreshing}
              onClick={handleRefresh}
              size='icon'
              className={cn(
                'overflow-hidden transition-colors duration-300 cursor-pointer',
                showCheckmark
                  ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 border-blue-400 dark:border-blue-600'
                  : 'hover:bg-muted',
              )}
            >
              <span className='relative inline-flex h-4 w-4 items-center justify-center'>
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                    showCheckmark
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0',
                  )}
                >
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    className='size-3.5 text-blue-500'
                  />
                </div>
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                    showCheckmark
                      ? 'scale-0 opacity-0'
                      : 'scale-100 opacity-100',
                  )}
                >
                  <HugeiconsIcon
                    icon={Refresh01Icon}
                    className={cn(
                      'size-3.5 transition-opacity duration-300 ease-in-out',
                      isSpinning
                        ? 'animate-spin-accelerate opacity-100'
                        : 'opacity-75',
                    )}
                  />
                </div>
              </span>
              <span className='sr-only'>Refresh</span>
            </Button>
          }
        />
        <TooltipPopup side='bottom'>Refresh</TooltipPopup>
      </Tooltip>
    </TooltipProvider>
  )
}
