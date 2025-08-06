import { ArrowUpRight } from 'lucide-react'
import { Icons } from '~/components/icons'
import { submitAnalytics } from '~/lib/actions'

const steps = [
  "Add the network to Metamask by clicking 'Add to Metamask' button.",
  'Click on "Deploy and Run Transactions" button on left sidebar.',
  'Click on "Environment" dropdown and select "Injected Provider - Metamask"',
  'Your Remix IDE will be connected to the BuildBear Sandbox you just created.',
]

export const SandboxHelp = () => {
  return (
    <div className="py-3 flex flex-col gap-3 w-full break-all border-t dark:border-gray-700 bg-slate-100 dark:!bg-transparent">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2.5 px-3">
          <span className="font-medium text-xs flex items-center gap-1">
            <Icons.Help className="size-4" strokeWidth={1.5} />
            How to use
          </span>
          <a
            href={import.meta.env.VITE_TELEGRAM_CHANNEL ?? ''}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 text-xs font-medium appearance-none border-none bg-transparent !no-underline !outline-none dark:text-muted"
            onMouseDown={async () => {
              await submitAnalytics({
                button: 'get-support',
                title: 'Get Support',
              })
            }}
          >
            <Icons.Telegram className="size-4" strokeWidth={1.5} />
            Get Support
            <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.5} />
          </a>
        </div>

        <ol className="list-decimal list-outside text-xs text-gray-500 dark:text-gray-400 ml-4 space-y-2 px-2.5 break-keep text-balance [&>li]:pl-1">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
