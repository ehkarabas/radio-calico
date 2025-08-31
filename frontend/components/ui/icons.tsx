import {
  Loader2,
  Mail,
  Eye,
  EyeOff,
  Github,
  Chrome,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Clock,
  AlertCircle,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  spinner: Loader2,
  mail: Mail,
  eye: Eye,
  eyeOff: EyeOff,
  gitHub: Github,
  google: Chrome, // Using Chrome as Google icon placeholder
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  check: Check,
  close: X,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: XCircle,
  settings: Settings,
  user: User,
  logout: LogOut,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  clock: Clock,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  shield: Shield,
  // Custom SVG icons can be added here
  logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  radio: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  ),
} as const