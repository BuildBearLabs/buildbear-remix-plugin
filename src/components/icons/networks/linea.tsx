import type { SvgIconProps } from '~/lib/types'

export const LineaIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Linea Icon</title>
      <rect width="28" height="28" rx="14" fill="black" />
      <path d="M21.8506 5.9231H7V21.4355H21.8506V5.9231Z" fill="black" />
      <path
        d="M19.3335 21.4351L7 21.4355L7.00008 8.43989H9.82199V18.9166H19.3335V21.4351Z"
        fill="white"
      />
      <path
        d="M19.3327 10.9574C20.7229 10.9574 21.8499 9.83046 21.8499 8.44026C21.8499 7.05007 20.7229 5.9231 19.3327 5.9231C17.9426 5.9231 16.8156 7.05007 16.8156 8.44026C16.8156 9.83046 17.9426 10.9574 19.3327 10.9574Z"
        fill="white"
      />
    </svg>
  )
}
