"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { configuracaoAPI } from "@/lib/api/configuracao"
import type { AccountSettings } from "@/lib/interface/configuracao"

interface AccountTabProps {
  onSuccess: (message: string) => void
}

export function AccountTab({ onSuccess }: AccountTabProps) {
  const { toast } = useToast()

  // form fields
  const [language, setLanguage] = useState("pt-BR")
  const [timezone, setTimezone] = useState("America/Sao_Paulo")
  const [profilePublic, setProfilePublic] = useState(true)
  const [shareUsage, setShareUsage] = useState(true)

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 1) on mount, load current settings
  useEffect(() => {
    setIsLoading(true)
    configuracaoAPI
      .getAccountSettings() // assume this GET endpoint exists
      .then((settings: AccountSettings) => {
        setLanguage(settings.language ?? "pt-BR")
        setTimezone(settings.timezone ?? "America/Sao_Paulo")
        setProfilePublic(settings.profilePublic)
        setShareUsage(settings.shareUsage)
      })
      .catch((err: any) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar configurações",
          description: err.message || "Tente novamente mais tarde.",
        })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await configuracaoAPI.updateAccountSettings({
        language,
        timezone,
        profilePublic,
        shareUsage,
      })
      onSuccess("Configurações da conta salvas com sucesso!")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // função que realmente exclui a conta
  const confirmDeleteAccount = async () => {
    setIsDeleteDialogOpen(false)
    setIsSaving(true)
    try {
      await configuracaoAPI.deleteAccount()
      onSuccess("Conta excluída com sucesso.")
      // aqui você pode redirecionar / fazer logout
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: err.message || "Tente novamente mais tarde.",
      })
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
          <CardDescription>
            Gerencie as configurações da sua conta e preferências de idioma.
          </CardDescription>
        </CardHeader>
  
        <CardContent className="space-y-6 opacity-75 hover:opacity-100 transition-opacity">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}
  
          {/* Idioma e região */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Idioma e região</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  disabled={isLoading}
                  value={language}
                  onValueChange={setLanguage}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione um idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso horário</Label>
                <Select
                  disabled={isLoading}
                  value={timezone}
                  onValueChange={setTimezone}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione um fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">
                      Brasília (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      New York (GMT-4)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      London (GMT+1)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
  
          <Separator />
  
          {/* Privacidade */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Privacidade</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Compartilhar dados de uso</div>
                  <div className="text-sm text-muted-foreground">
                    Ajude-nos a melhorar compartilhando dados anônimos de uso.
                  </div>
                </div>
                <Switch
                  disabled={isLoading}
                  checked={shareUsage}
                  onCheckedChange={setShareUsage}
                />
              </div>
            </div>
          </div>
  
          <Separator />
  
          {/* Zona de perigo */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-destructive">Zona de perigo</h3>
            <div className="space-y-4">
              <div className="rounded-md border border-destructive/50 p-4">
                <div className="space-y-2">
                  <div className="font-medium text-destructive">Excluir conta</div>
                  <div className="text-sm text-muted-foreground">
                    Excluir permanentemente sua conta e todos os seus dados. Esta
                    ação não pode ser desfeita.
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isSaving}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir minha conta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isSaving || isLoading}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </Card>
  
      {/* Modal de confirmação */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir sua conta? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAccount}
              disabled={isSaving}
            >
              {isSaving ? "Excluindo..." : "Excluir conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
  
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
