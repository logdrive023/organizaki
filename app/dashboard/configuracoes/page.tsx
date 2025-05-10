"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardAd } from "@/components/dashboard/dashboard-ad"
import { ProfileTab } from "@/components/settings/profile-tab"
import { PasswordTab } from "@/components/settings/password-tab"
import { NotificationsTab } from "@/components/settings/notifications-tab"
import { AdsTab } from "@/components/settings/ads-tab"
import { AccountTab } from "@/components/settings/account-tab"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [successMessage, setSuccessMessage] = useState("")

  // Função para exibir mensagem de sucesso temporária
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e informações da conta.</p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Anúncio no topo da página de configurações */}
      <DashboardAd slot="settings-top" format="horizontal" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="anuncios">Anúncios</TabsTrigger>
          <TabsTrigger value="conta">Conta</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <ProfileTab onSuccess={showSuccessMessage} />
        </TabsContent>

        {/* Senha */}
        <TabsContent value="senha" className="space-y-6">
          <PasswordTab onSuccess={showSuccessMessage} />
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <NotificationsTab onSuccess={showSuccessMessage} />
        </TabsContent>

        {/* Anúncios */}
        <TabsContent value="anuncios" className="space-y-6">
          <AdsTab onSuccess={showSuccessMessage} />
        </TabsContent>

        {/* Conta */}
        <TabsContent value="conta" className="space-y-6">
          <AccountTab onSuccess={showSuccessMessage} />
        </TabsContent>
      </Tabs>

      {/* Anúncio no final da página de configurações */}
      <DashboardAd slot="settings-bottom" format="horizontal" />
    </div>
  )
}
