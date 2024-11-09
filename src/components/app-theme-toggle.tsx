import { useTheme } from '@/components/app-theme-provider.tsx'
import { Switch } from '@/components/ui/switch.tsx'

export function AppThemeSwitch() {
  const { setTheme, theme } = useTheme()

  const isDark = theme === 'dark'

  return <Switch checked={isDark} onCheckedChange={() => setTheme(isDark ? 'light' : 'dark')} />
}
