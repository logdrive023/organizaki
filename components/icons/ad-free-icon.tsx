import * as React from "react"
import { Ban } from "lucide-react"

interface AdFreeIconProps {
  className?: string
}

export function AdFreeIcon({ className = "h-4 w-4" }: AdFreeIconProps) {
  return (
    <div className="relative inline-block">
      <Ban className={className} />
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
    </div>
  )
}
