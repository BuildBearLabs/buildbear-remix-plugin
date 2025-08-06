export const Header = () => {
  return (
    <header className="flex items-center gap-2 px-3 py-2 border-y !border-gray-200 dark:!border-gray-700 bg-white dark:!bg-transparent">
      <img
        src="https://r2.buildbear.io/brand-v2/logo/svg/Logo-Mark-Green.svg"
        alt="BuildBear Labs"
        className="h-6"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium dark:text-white">
          BuildBear Labs Sandbox
        </span>
        <a
          href="https://buildbear.io?utm_source=remix-ide&utm_medium=plugin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          buildbear.io
        </a>
      </div>
    </header>
  )
}

Header.displayName = 'Header'
