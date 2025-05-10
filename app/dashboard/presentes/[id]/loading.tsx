import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function GiftDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Imagem do presente */}
        <Skeleton className="aspect-square w-full rounded-lg" />

        {/* Informações do presente */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-6 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-6 w-24" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="mt-1 h-2 w-full" />
            </div>

            <div className="mt-6 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="mt-4">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
