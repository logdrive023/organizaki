"use client"

import { useState } from "react"
import { Ban, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { useAdsSettings } from "../../store/use-ads-settings"
import { AdFreeIcon } from "../icons/ad-free-icon"
import { Badge } from "../ui/badge"

export function AdsSettingsDialog() {
  const { showAds, isPremium, toggleAds, setPremium } = useAdsSettings()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handlePremiumPurchase = () => {
    setIsProcessing(true)

    // Simulando processamento de pagamento
    setTimeout(() => {
      setPremium(true)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isPremium ? (
            <>
              <AdFreeIcon className="h-4 w-4" />
              <span>Sem anúncios</span>
              <Badge variant="secondary" className="ml-1 px-1 text-xs">
                Premium
              </Badge>
            </>
          ) : (
            <>
              <Ban className="h-4 w-4" />
              <span>Remover anúncios</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações de anúncios</DialogTitle>
          <DialogDescription>Gerencie como os anúncios são exibidos na plataforma.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-ads">Exibir anúncios</Label>
              <p className="text-sm text-muted-foreground">Ative ou desative a exibição de anúncios na plataforma.</p>
            </div>
            <Switch id="show-ads" checked={showAds} onCheckedChange={toggleAds} disabled={isProcessing} />
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <AdFreeIcon className="mt-1 h-10 w-10 text-primary" />
                <div>
                  <h4 className="font-medium">Remova anúncios permanentemente</h4>
                  <p className="text-sm text-muted-foreground">
                    Por apenas R$ 10,00, você pode remover todos os anúncios da plataforma permanentemente.
                  </p>
                </div>
              </div>

              {isPremium ? (
                <div className="rounded-md bg-muted p-3 text-center">
                  <p className="text-sm font-medium">
                    Você já é um usuário premium! Aproveite a plataforma sem anúncios.
                  </p>
                </div>
              ) : (
                <Button className="w-full" onClick={handlePremiumPurchase} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Pagar R$ 10,00"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
