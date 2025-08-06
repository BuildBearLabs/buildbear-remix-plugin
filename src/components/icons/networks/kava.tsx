import type { SvgIconProps } from '~/lib/types'

export const KavaIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Kava Icon</title>
      <rect width="28" height="28" rx="14" fill="#FF433E" />
      <path
        d="M14 23.625C19.3157 23.625 23.625 19.3157 23.625 14C23.625 8.68426 19.3157 4.375 14 4.375C8.68426 4.375 4.375 8.68426 4.375 14C4.375 19.3157 8.68426 23.625 14 23.625Z"
        fill="#FF433E"
      />
      <path
        d="M11.4509 8.44307H9.51084V19.5645H11.4509V8.44307Z"
        fill="white"
      />
      <path
        d="M16.7597 19.5569L12.5036 14L16.7597 8.44307H19.1885L15.0001 14L19.1885 19.5569H16.7597Z"
        fill="white"
      />
    </svg>
  )
}
