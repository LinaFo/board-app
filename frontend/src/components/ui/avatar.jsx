// frontend/src/components/ui/avatar.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({ className, size = "default", ...props }) {
  const sizeClasses = {
    default: "size-8",
    sm: "size-6",
    lg: "size-12",
  }

  return (
    <div
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }) {
  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs uppercase",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }) {
  return (
    <div
      data-slot="avatar-badge"
      className={cn(
        "pointer-events-none absolute bottom-0 right-0 block size-2.5 rounded-full ring-2 ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-3", className)}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs ring-2 ring-background",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}