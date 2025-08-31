import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
}

export function useToast() {
  const toast = ({ variant = 'default', title, description }: ToastOptions) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description,
      })
    } else {
      sonnerToast.success(title, {
        description,
      })
    }
  }

  return { toast }
}