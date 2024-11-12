import { Toaster } from '@/components/ui/toaster.tsx'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function storageGet(key: string): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(key) as Theme
}

function storageSet(key: string, value: Theme) {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(key, value)
}

export function AppThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (storageGet(storageKey) as Theme) || defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      storageSet(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a AppThemeProvider')

  return context
}
