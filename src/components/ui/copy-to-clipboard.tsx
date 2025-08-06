'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { Icons } from '~/components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/utils'

interface CopyToClipboardProps extends React.ComponentProps<'button'> {
  text?: string
  tooltipLabel?: string
  as?: React.ElementType
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right'
  noCopyIcon?: boolean
}

export const CopyToClipboard = ({
  text,
  tooltipLabel,
  tooltipSide = 'top',
  as: Component = 'button',
  className,
  value,
  children,
  noCopyIcon,
  ...props
}: CopyToClipboardProps) => {
  const [state, setState] = useOptimistic<'idle' | 'copied'>('idle')
  const [, startTransition] = useTransition()

  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy)
        return true
      } catch (error) {
        console.warn(
          'Clipboard API failed, falling back to execCommand:',
          error,
        )
      }
    }

    // Fallback to legacy method
    try {
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        return true
      }
      throw new Error('execCommand failed')
    } catch (error) {
      console.error('All clipboard methods failed:', error)
      return false
    }
  }

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    startTransition(async () => {
      const textToCopy = String(value ?? text ?? 'No text to copy')
      const success = await copyToClipboard(textToCopy)

      if (success) {
        setState('copied')
        toast.success('Copied to clipboard', {
          description: value ?? text,
          duration: 1000,
        })
      } else {
        toast.error('Failed to copy to clipboard', {
          description: 'Please copy manually',
          duration: 2000,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setState('idle')
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Component
          type="button"
          className={cn(
            'flex items-center gap-1.5 text-sm text-muted appearance-none border-none bg-transparent !outline-none',
            className,
          )}
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          {...props}
        >
          {children}
          {!noCopyIcon && state === 'copied' ? (
            <Icons.Check className="!size-3.5 text-green-400 shrink-0" />
          ) : (
            !noCopyIcon && (
              <Icons.Copy
                className="shrink-0 !size-3.5 text-muted cursor-pointer hover:text-default-text dark:text-gray-300"
                strokeWidth={2}
              />
            )
          )}
        </Component>
      </TooltipTrigger>
      <TooltipContent
        side={tooltipSide}
        className="text-xs max-w-none !w-[var(--radix-tooltip-trigger-width)] min-w-[100px] text-center"
      >
        {tooltipLabel ?? 'Copy to Clipboard'}
      </TooltipContent>
    </Tooltip>
  )
}
