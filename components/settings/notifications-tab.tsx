"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

import { configuracaoAPI } from "@/lib/api/configuracao"
import type {
    NotificationSettings,
    NotificationSettingsRequest,
} from "@/lib/interface/configuracao"

interface NotificationsTabProps {
    onSuccess: (message: string) => void
}

export function NotificationsTab({ onSuccess }: NotificationsTabProps) {
    const { toast } = useToast()

    // Local state for each preference
    const [emailConfirmations, setEmailConfirmations] = useState(false)
    const [emailGifts, setEmailGifts] = useState(false)
    const [emailReminders, setEmailReminders] = useState(false)
    const [emailSystemUpdates, setEmailSystemUpdates] = useState(false)
    const [inAppAllActivities, setInAppAllActivities] = useState(false)
    const [inAppSound, setInAppSound] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Fetch current settings on mount
    useEffect(() => {
        ; (async () => {
            try {
                setIsLoading(true)
                const settings: NotificationSettings =
                    await configuracaoAPI.getNotificationSettings()
                setEmailConfirmations(settings.email.guestConfirm)
                setEmailGifts(settings.email.giftReserved)
                setEmailReminders(settings.email.eventReminder)
                setEmailSystemUpdates(settings.email.systemUpdates)
                setInAppAllActivities(settings.inApp.allActivities)
                setInAppSound(settings.inApp.sound)
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar preferências",
                    description: err.message || "Tente novamente mais tarde.",
                })
            } finally {
                setIsLoading(false)
            }
        })()
    }, [toast])

    const handleSavePreferences = async () => {
        setIsSaving(true)
        try {
            await configuracaoAPI.updateNotificationSettings({
                email: {
                    guestConfirm: emailConfirmations,
                    giftReserved: emailGifts,
                    eventReminder: emailReminders,
                    systemUpdates: emailSystemUpdates,
                },
                inApp: {
                    allActivity: inAppAllActivities,
                    sound: inAppSound,
                },
            })
            onSuccess("Preferências de notificações salvas com sucesso!")
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar preferências",
                description: err.message || "Tente novamente mais tarde.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                    Configure como e quando você deseja receber notificações.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Email notifications */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações por e-mail</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Confirmações de convidados</div>
                                <div className="text-sm text-muted-foreground">
                                    Receba um e-mail quando um convidado confirmar presença.
                                </div>
                            </div>
                            <Switch
                                checked={emailConfirmations}
                                onCheckedChange={setEmailConfirmations}
                                disabled={isLoading}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Presentes reservados</div>
                                <div className="text-sm text-muted-foreground">
                                    Receba um e-mail quando um presente for reservado.
                                </div>
                            </div>
                            <Switch
                                checked={emailGifts}
                                onCheckedChange={setEmailGifts}
                                disabled={isLoading}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Lembretes de eventos</div>
                                <div className="text-sm text-muted-foreground">
                                    Receba lembretes sobre seus eventos próximos.
                                </div>
                            </div>
                            <Switch
                                checked={emailReminders}
                                onCheckedChange={setEmailReminders}
                                disabled={isLoading}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Novidades e atualizações</div>
                                <div className="text-sm text-muted-foreground">
                                    Receba informações sobre novos recursos e atualizações da
                                    plataforma.
                                </div>
                            </div>
                            <Switch
                                checked={emailSystemUpdates}
                                onCheckedChange={setEmailSystemUpdates}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* In-app notifications */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações no aplicativo</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Todas as atividades</div>
                                <div className="text-sm text-muted-foreground">
                                    Receba notificações para todas as atividades relacionadas aos
                                    seus eventos.
                                </div>
                            </div>
                            <Switch
                                checked={inAppAllActivities}
                                onCheckedChange={setInAppAllActivities}
                                disabled={isLoading}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Som de notificação</div>
                                <div className="text-sm text-muted-foreground">
                                    Ative o som para novas notificações.
                                </div>
                            </div>
                            <Switch
                                checked={inAppSound}
                                onCheckedChange={setInAppSound}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSavePreferences}
                        disabled={isLoading || isSaving}
                    >
                        {isSaving ? "Salvando..." : "Salvar preferências"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
