import { Copy } from 'lucide-react'
import type { ReactNode } from 'react'
import { CopyToClipboard, Label } from '~/components/ui'

interface DataRowProps {
  label: string
  value: ReactNode | string
  icon?: ReactNode
  isCopyable?: boolean
  copyValue?: string
  copyTooltip?: string
}

export const DataRow = ({
  label,
  value,
  icon,
  isCopyable,
  copyValue,
  copyTooltip,
}: DataRowProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Label className="shrink-0 m-0 flex items-center gap-1">
        {label}
        {icon}
      </Label>

      {isCopyable && (
        <CopyToClipboard
          value={copyValue ?? ''}
          tooltipLabel={copyTooltip ?? 'Copy'}
        >
          <DataRowValue value={value} />
        </CopyToClipboard>
      )}

      {!isCopyable && <DataRowValue value={value} />}
    </div>
  )
}

DataRow.displayName = 'DataRow'

const DataRowValue = ({ value }: { value: ReactNode | string }) => {
  return (
    <span className="text-xs dark:text-white font-mono font-medium text-right line-clamp-1">
      {value}
    </span>
  )
}
