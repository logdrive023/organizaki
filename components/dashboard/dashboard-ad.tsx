import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface DashboardAdProps {
  position: "top" | "middle" | "bottom" | "sidebar"
}

export function DashboardAd({ position }: DashboardAdProps) {
  // Diferentes formatos de anúncios baseados na posição
  const adSizes = {
    top: "h-20",
    middle: "h-16",
    bottom: "h-20",
    sidebar: "h-40",
  }

  // Diferentes slots de anúncios baseados na posição
  const adSlots = {
    top: "1234567890",
    middle: "0987654321",
    bottom: "1122334455",
    sidebar: "5566778899",
  }

  return (
    <Card
      className={`relative w-full ${adSizes[position]} flex items-center justify-center border border-dashed border-gray-300 bg-gray-50 overflow-hidden mb-6`}
    >
      <div className="text-center">
        <p className="text-muted-foreground font-medium">Publicidade vai aqui</p>
        <p className="text-xs text-muted-foreground">
          {position === "sidebar" ? "300x600" : "728x90"} - Slot: {adSlots[position]}
        </p>
      </div>
      <Badge variant="outline" className="absolute top-2 right-2 text-xs">
        Ad
      </Badge>
    </Card>
  )
}
