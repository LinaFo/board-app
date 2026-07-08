// frontend/src/components/ui/bubble.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Bubble({ className, variant = "default", align = "start", ...props }) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    muted: "bg-muted text-muted-foreground",
    tinted: "bg-primary/10 text-primary",
    outline: "border border-border bg-background",
    ghost: "bg-transparent p-0",
    destructive: "bg-destructive/10 text-destructive",
  }

  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "flex max-w-[80%] flex-col gap-1",
        {
          "self-start": align === "start",
          "self-end": align === "end",
        },
        className
      )}
      {...props}
    />
  )
}

function BubbleContent({ className, variant = "default", render, ...props }) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    muted: "bg-muted text-muted-foreground",
    tinted: "bg-primary/10 text-primary",
    outline: "border border-border bg-background",
    ghost: "bg-transparent p-0",
    destructive: "bg-destructive/10 text-destructive",
  }

  const Comp = render ? (typeof render === "function" ? render : render.type) : "div"
  const renderProps = render ? (typeof render === "function" ? {} : render.props) : {}

  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        "rounded-2xl px-4 py-2.5 text-sm",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...renderProps}
      {...props}
    />
  )
}

function BubbleReactions({ className, side = "bottom", align = "end", ...props }) {
  return (
    <div
      data-slot="bubble-reactions"
      data-side={side}
      data-align={align}
      className={cn(
        "flex gap-1",
        {
          "self-start": align === "start",
          "self-end": align === "end",
        },
        className
      )}
      {...props}
    />
  )
}

function BubbleGroup({ className, ...props }) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

export {
  Bubble,
  BubbleContent,
  BubbleReactions,
  BubbleGroup,
}