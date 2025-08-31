import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Responsive sizing - height, padding, text
        "h-7 ehlogo:h-6 xs:h-8 sm:h-9 md:h-10",
        "px-2 ehlogo:px-1.5 xs:px-2.5 sm:px-3 md:px-4",
        "py-1 ehlogo:py-0.5 xs:py-1 sm:py-1.5",
        "text-xs ehlogo:text-[10px] xs:text-sm sm:text-base md:text-sm",
        // File input responsive sizing
        "file:h-5 ehlogo:file:h-4 xs:file:h-6 sm:file:h-7",
        "file:text-xs ehlogo:file:text-[10px] xs:file:text-sm sm:file:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
