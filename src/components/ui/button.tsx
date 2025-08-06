import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '~/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap !rounded-sm text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 !ring-0 !outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary !text-white shadow',
        destructive:
          'bg-transparent border !border-red-200 dark:!border-red-900 text-red-500 hover:bg-red-500/10',
        outline:
          'border !text-gray-950 !border-gray-200 dark:!border-gray-700 bg-transparent hover:dark:!bg-gray-950 dark:!text-white hover:text-accent-foreground',
        secondary:
          'dark:!bg-gray-700 bg-gray-100 dark:!text-white border !border-gray-300/70 dark:!border-transparent hover:dark:!bg-gray-600 text-gray-900 hover:dark:bg-gray-900',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-8 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
