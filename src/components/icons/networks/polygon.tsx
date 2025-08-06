import type { SvgIconProps } from '~/lib/types'

export const PolygonIcon = ({ ...props }: SvgIconProps) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <title>Polygon Icon</title>
      <g clipPath="url(#clip0_10_279)">
        <path d="M32 0H0V32H32V0Z" fill="#6C00F6" />
        <path
          d="M19.4492 8.85172L14.9842 11.4162V19.4198L12.5205 20.8479L10.0418 19.4187V16.5612L12.5205 15.1458L14.1143 16.07V13.7581L12.5066 12.8454L8.04262 15.4388V20.5688L12.5217 23.1483L16.9856 20.5688V12.5663L19.4644 11.137L21.9419 12.5663V15.411L19.4644 16.8531L17.8566 15.9206V18.221L19.4492 19.1395L23.9572 16.5751V11.4162L19.4492 8.85172Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_10_279">
          <rect width="32" height="32" rx="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
