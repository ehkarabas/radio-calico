"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Responsive gap and text sizing
        "gap-1 ehlogo:gap-0.5 xs:gap-1.5 sm:gap-2",
        "text-xs ehlogo:text-[10px] xs:text-sm sm:text-base md:text-sm",
        "leading-none font-medium break-words",
        className
      )}
      {...props}
    />
  )
}

export { Label }
