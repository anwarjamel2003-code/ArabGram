import React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  src?: string
  alt?: string
}

export function Avatar({ className, src, alt, children, ...props }: AvatarProps) {
  return (
    <div 
      className={cn("relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-background", className)} 
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt || ""} 
          className="h-full w-full object-cover" 
        />
      ) : (
        children
      )}
    </div>
  )
}

export function AvatarImage({ className, src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img 
      src={src} 
      alt={alt || ""} 
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium", className)}
      {...props}
    >
      {children}
    </div>
  )
}
