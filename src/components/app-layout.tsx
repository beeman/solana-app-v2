import { AppThemeSwitch } from '@/components/app-theme-toggle.tsx'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppThemeProvider } from './app-theme-provider.tsx'

export function AppLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  return (
    <AppThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <AppHeader links={links} />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <AppFooter />
      </div>
    </AppThemeProvider>
  )
}

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const { pathname } = useLocation()

  return (
    <header className="px-4 py-2 bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link className="text-xl hover:text-gray-500 dark:hover:text-white" to="/">
            <span>Placeholder</span>
          </Link>

          <ul className="flex gap-2 flex-nowrap">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link className={pathname.startsWith(path) ? 'text-gray-500 dark:text-white' : ''} to={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <AppThemeSwitch />
        </div>
      </div>
    </header>
  )
}

export function AppFooter() {
  return (
    <footer className="text-center p-2 bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
      Generated by{' '}
      <a
        className="link hover:text-gray-500 dark:hover:text-white"
        href="https://github.com/solana-developers/create-solana-dapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        create-solana-dapp
      </a>
    </footer>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="flex flex-row justify-center py-[64px]">
      <div className="text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}
