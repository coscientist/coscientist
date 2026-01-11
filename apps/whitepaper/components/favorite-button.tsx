'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const FavoriteButton = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPinging, setIsPinging] = useState(false)

  useEffect(() => {
    if (isProcessing) {
      setIsPinging(true)
      return
    }
  }, [isProcessing])

  const handleClick = async () => {
    setIsProcessing(true)
    // Simulate async operation with 2-second delay
    setTimeout(() => {
      setIsFavorite(!isFavorite)
      toast.success(`${isFavorite ? 'Removed from' : 'Added to'} favorites`)
      setIsProcessing(false)
      setIsPinging(false)
    }, 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled={isPinging}
              onClick={handleClick}
              size='icon'
              variant='outline'
              className={cn(
                'transition-colors duration-300 cursor-pointer',
                isFavorite
                  ? 'bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 border-red-400 dark:border-red-600'
                  : '',
              )}
            >
              <span className='relative inline-flex size-4 items-center justify-center'>
                <div className='relative inline-flex size-4 items-center justify-center'>
                  <span
                    className={cn(
                      'absolute inline-flex size-full rounded-full bg-red-400 transition-all duration-300 ease-in-out',
                      isPinging ? 'animate-ping opacity-75' : 'opacity-0',
                    )}
                  />
                  <div
                    className={cn(
                      'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                    )}
                  >
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      className={cn(
                        'size-4 transition-colors duration-300 ease-in-out',
                        isFavorite
                          ? 'text-red-500 fill-current'
                          : 'text-muted-foreground',
                      )}
                    />
                  </div>
                </div>
              </span>
              <span className='sr-only'>Favorite</span>
            </Button>
          }
        />
        <TooltipPopup side='bottom'>Favorite</TooltipPopup>
      </Tooltip>
    </TooltipProvider>
  )
}
