import type { SvgIconProps } from '~/lib/types'

export const EthereumIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <title>Ethereum Icon</title>
      <rect
        width="32"
        height="32"
        rx="16"
        className="fill-white dark:fill-gray-800"
      />
      <path
        d="M15.9989 5.71429L15.8574 6.18309V19.7854L15.9989 19.9231L22.4722 16.1909L15.9989 5.71429Z"
        className="fill-[#343434] dark:fill-white"
      />
      <path
        d="M15.9973 5.71429L9.52381 16.1909L15.9973 19.9231V13.3209V5.71429Z"
        className="fill-[#8C8C8C] dark:fill-gray-400"
      />
      <path
        d="M15.9989 21.1184L15.9192 21.2133V26.0586L15.9989 26.2857L22.4762 17.3882L15.9989 21.1184Z"
        className="fill-[#3C3C3B] dark:fill-white"
      />
      <path
        d="M15.9973 26.2857V21.1184L9.52381 17.3882L15.9973 26.2857Z"
        className="fill-[#8C8C8C] dark:fill-gray-400"
      />
      <path
        d="M15.9973 19.9231L22.4697 16.1906L15.9973 13.3209V19.9231Z"
        className="fill-[#141414] dark:fill-gray-600"
      />
      <path
        d="M9.52381 16.1909L15.9973 19.9231V13.3209L9.52381 16.1909Z"
        className="fill-[#393939] dark:fill-gray-600"
      />
    </svg>
  )
}
