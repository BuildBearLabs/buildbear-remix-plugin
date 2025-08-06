import type { SvgIconProps } from '~/lib/types'

export const CheckIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" />
    </svg>
  )
}
