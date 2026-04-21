import { cn } from "@/lib/utils"

interface AvatarProps {
  className?: string
  src?: string
  alt?: string
  fallback?: string
}

export function Avatar({ className, src, alt, fallback = "?" }: AvatarProps) {
  return (
    <div className={cn(
      "relative inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg ring-2 ring-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden",
      className
    )}>
      {src ? (
        <img 
          src={src} 
          alt={alt || "Avatar"}
          className="h-full w-full object-cover rounded-3xl"
        />
      ) : (
        <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
          {fallback}
        </span>
      )}
    </div>
  )
}

export function AvatarFallback({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-lg",
      className
    )}>
      {children}
    </div>
  )
}

