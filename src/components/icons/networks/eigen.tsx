import type { SvgIconProps } from '~/lib/types'

export const EigenIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="16" fill="#1A0C6D" />
      <path d="M22.9691 8H20.9747V12.001H22.9691V8Z" fill="white" />
      <path
        d="M18.9802 8H15.0658V9.99844H16.9818V15.9979H20.9747V12.001H18.9802V8Z"
        fill="white"
      />
      <path
        d="M14.9873 19.9989H12.9888V8H9V24H20.9747V19.9989H16.9818V15.9979H14.9873V19.9989Z"
        fill="white"
      />
    </svg>
  )
}
