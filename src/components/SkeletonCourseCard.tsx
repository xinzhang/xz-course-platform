import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function SkeletonArray({
  amount,
  children,
}: {
  amount: number
  children: ReactNode
}) {
  return Array.from({ length: amount }).map(() => children)
}

export function SkeletonText({
  rows = 1,
  size = "md",
  className,
}: {
  rows?: number
  size?: "md" | "lg"
  className?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <SkeletonArray amount={rows}>
        <div
          className={cn(
            "bg-secondary animate-pulse w-full rounded-sm",
            rows > 1 && "last:w-3/4",
            size === "md" && "h-3",
            size === "lg" && "h-5",
            className
          )}
        />
      </SkeletonArray>
    </div>
  )
}
