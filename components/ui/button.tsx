"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold shadow-lg shadow-black/10 hover:shadow-xl backdrop-blur-sm ring-offset-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-indigo-500/25 hover:shadow-indigo-600/40",
        destructive:
          "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 shadow-rose-500/25 hover:shadow-rose-600/40",
        outline:
          "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 hover:bg-white hover:dark:bg-gray-900 hover:border-indigo-500 hover:dark:border-purple-500 backdrop-blur-md text-foreground hover:text-indigo-600 dark:hover:text-purple-400",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 shadow-gray-200/50 hover:shadow-gray-300/70",
        ghost: "bg-transparent hover:bg-white/50 dark:hover:bg-gray-900/50 hover:backdrop-blur-sm text-foreground hover:shadow-md",
        link: "text-indigo-600 dark:text-purple-400 underline-offset-4 hover:underline hover:text-indigo-700 dark:hover:text-purple-500 font-medium bg-transparent shadow-none hover:shadow-none hover:scale-100",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2.5",
        lg: "h-14 rounded-3xl px-10 py-4 text-lg",
        icon: "h-12 w-12 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

