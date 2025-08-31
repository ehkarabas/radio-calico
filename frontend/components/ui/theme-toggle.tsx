"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Toggle } from "@/components/ui/toggle"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Toggle
        size="sm"
        className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md p-1 ehlogo:p-0.5 xs:p-2"
        aria-label="Toggle theme"
      >
        <Sun className="h-3 w-3 ehlogo:h-2.5 ehlogo:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
      </Toggle>
    )
  }

  const isDark = theme === "dark"

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={() => setTheme(isDark ? "light" : "dark")}
      size="sm"
      className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-accent/10 dark:hover:bg-accent/20 p-1 ehlogo:p-0.5 xs:p-2"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-3 w-3 ehlogo:h-2.5 ehlogo:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
      ) : (
        <Sun className="h-3 w-3 ehlogo:h-2.5 ehlogo:w-2.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
      )}
    </Toggle>
  )
}