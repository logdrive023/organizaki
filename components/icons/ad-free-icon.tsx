import { Ban } from "lucide-react"

export function AdFreeIcon() {
  return (
    <div className="relative">
      <Ban className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
    </div>
  )
}
