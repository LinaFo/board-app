// frontend/src/components/ui/message-scroller.jsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function MessageScrollerProvider({
  children,
  autoScroll = false,
  ...props
}) {
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const scrollRef = React.useRef(null)

  React.useEffect(() => {
    if (autoScroll && isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [children, autoScroll, isAtBottom])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isBottom = scrollHeight - scrollTop <= clientHeight + 10
      setIsAtBottom(isBottom)
    }
  }

  return (
    <div className="relative flex-1">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onScroll: handleScroll,
            scrollRef,
          })
        }
        return child
      })}
    </div>
  )
}

export function MessageScroller({ className, children, ...props }) {
  return (
    <div className={cn("relative flex-1 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export function MessageScrollerViewport({ className, children, onScroll, scrollRef, ...props }) {
  return (
    <div
      ref={scrollRef}
      className={cn("h-full overflow-y-auto overscroll-contain", className)}
      onScroll={onScroll}
      {...props}
    >
      {children}
    </div>
  )
}

export function MessageScrollerContent({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col gap-3 p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function MessageScrollerItem({ className, children, messageId, scrollAnchor = false, ...props }) {
  return (
    <div
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor}
      className={cn("scroll-mt-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function MessageScrollerButton({ className, onClick, ...props }) {
  return (
    <button
      className={cn(
        "absolute bottom-4 right-4 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-105",
        className
      )}
      onClick={onClick}
      {...props}
    >
      ↓
    </button>
  )
}