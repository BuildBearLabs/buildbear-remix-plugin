import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '~/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-1.5 py-0 h-4 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-1 select-none text-center justify-center',
  {
    variants: {
      variant: {
        yellow:
          'border dark:bg-[#665200] dark:text-[#FFDF5C] bg-[#FFF7D6] text-[#A54800] border-[#FFD93D] dark:!border-[#A38300]',

        green:
          'dark:bg-[#0A332B] dark:text-[#5EDEC6] bg-[#F1FCF8] text-[#1B8672] !border-[#1B8672] border',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
