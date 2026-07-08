// frontend/src/components/ui/message.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Message({ className, align = "start", ...props }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "flex gap-3",
        {
          "flex-row": align === "start",
          "flex-row-reverse": align === "end",
        },
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }) {
  return (
    <div
      data-slot="message-avatar"
      className={cn("flex items-end", className)}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }) {
  return (
    <div
      data-slot="message-content"
      className={cn("flex max-w-[80%] flex-col gap-1", className)}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }) {
  return (
    <div
      data-slot="message-header"
      className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }) {
  return (
    <div
      data-slot="message-footer"
      className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function MessageGroup({ className, ...props }) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
  MessageGroup,
}