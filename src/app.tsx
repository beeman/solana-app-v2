import { AppDemoDialog } from "@/app-demo-dialog.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Button } from "@/components/ui/button.tsx";

export function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1 className="text-3xl font-bold underline">
        Vite + React + Tailwind
      </h1>
      <Button>Click me</Button>

      <ModeToggle/>
      <AppDemoDialog />
    </ThemeProvider>
  )
}
