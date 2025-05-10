"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { configuracaoAPI } from "@/lib/api/configuracao"
import { useAdsSettings } from "@/store/use-ads-settings"
import { AdsSettingsDialog } from "@/components/dashboard/ads-settings-dialog"
import { FullscreenIcon as AdFreeIcon } from "lucide-react"

interface AdsTabProps {
    onSuccess: (message: string) => void
}

export function AdsTab({ onSuccess }: AdsTabProps) {
    const { toast } = useToast()
    const { showAds, isPremium, toggleAds, setPremium } = useAdsSettings()
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    // fetch current ads settings on mount
    useEffect(() => {
        configuracaoAPI
            .getAdsSettings()
            .then(({ showAds: apiShowAds, isPremium: apiIsPremium }) => {
                // primeiro, aplique o sinalizador premium (isso também define showAds como falso se for premium)
                setPremium(apiIsPremium)

                // se o showAds da API não estiver em conformidade com o valor atual da loja, alterne uma vez
                if (apiShowAds !== showAds) {
                    toggleAds()
                }
            })
            .catch((err: any) => {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar configurações de anúncios",
                    description: err.message || "Usando modo premium por padrão.",
                })
                // fallback to premium mode
                setPremium(false)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [showAds, setPremium, toggleAds, toast])


    const handleConfirmPurchase = async () => {
        setIsProcessingPayment(true)
        try {
            await configuracaoAPI.purchasePremium()
            setPremium(true)
            onSuccess("Parabéns! Você agora é um usuário premium sem anúncios.")
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Falha na compra",
                description: err.message || "Tente novamente.",
            })
        } finally {
            setIsProcessingPayment(false)
            setDialogOpen(false)
        }
    }

    if (isLoading) {
        return (
            <Card className="p-8 text-center">
                <p>Carregando configurações de anúncios…</p>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configurações de Anúncios</CardTitle>
                    <CardDescription>Gerencie como os anúncios são exibidos na plataforma.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isPremium ? (
                        <div className="py-6 flex flex-col items-center justify-center space-y-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <AdFreeIcon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-medium text-center">Você é um usuário premium!</h3>
                            <p className="text-center text-muted-foreground">
                                Todos os anúncios foram removidos da plataforma. Obrigado por apoiar nosso serviço.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="font-medium">Exibir anúncios</div>
                                        <div className="text-sm text-muted-foreground">Controle a exibição de anúncios na plataforma</div>
                                    </div>
                                    <Switch checked={showAds} onCheckedChange={toggleAds} />
                                </div>
                                <Separator />
                                <div className="rounded-lg border p-4 bg-muted/50">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <AdFreeIcon className="h-5 w-5 text-primary" />
                                            <h3 className="text-lg font-medium">Remova anúncios permanentemente</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Por apenas R$ 10,00, você pode remover todos os anúncios da plataforma permanentemente.
                                        </p>
                                        <AdsSettingsDialog
                                            open={dialogOpen}
                                            onOpenChange={setDialogOpen}
                                            onConfirm={handleConfirmPurchase}
                                            isProcessing={isProcessingPayment}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
