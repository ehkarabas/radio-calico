'use client'

import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HomeButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-8 w-8 xxs:h-9 xxs:w-9 p-0 hover:bg-accent hover:text-accent-foreground transition-colors btn"
      aria-label="Go to home page"
    >
      <Home className="h-4 w-4 xxs:h-4 xxs:w-4" />
    </Button>
  )
}