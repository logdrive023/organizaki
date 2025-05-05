"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  bio: z.string().max(160).optional(),
  phone: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "A senha atual é obrigatória" }),
    newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "A confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Usuário Demo",
      email: "usuario@exemplo.com",
      bio: "Organizador de eventos apaixonado por criar momentos inesquecíveis.",
      phone: "(11) 98765-4321",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsSaving(true)
    // Simulando uma chamada de API
    setTimeout(() => {
      console.log("Perfil atualizado:", data)
      setSuccessMessage("Perfil atualizado com sucesso!")
      setIsSaving(false)

      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }, 1000)
  }

  function onPasswordSubmit(data: z.infer<typeof passwordFormSchema>) {
    setIsSaving(true)
    // Simulando uma chamada de API
    setTimeout(() => {
      console.log("Senha atualizada:", data)
      setSuccessMessage("Senha atualizada com sucesso!")
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsSaving(false)

      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }, 1000)
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="conta">Conta</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais. Estas informações serão exibidas publicamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/diverse-user-avatars.png" alt="@usuário" />
                        <AvatarFallback>UD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Alterar foto
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Conte um pouco sobre você"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Você pode usar até 160 caracteres para sua bio.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Senha */}
        <TabsContent value="senha" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Senha</CardTitle>
              <CardDescription>
                Altere sua senha. Após a alteração, você precisará fazer login novamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha atual</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormDescription>A senha deve ter pelo menos 6 caracteres.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar nova senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Atualizando..." : "Atualizar senha"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure como e quando você deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Presentes reservados</div>
                      <div className="text-sm text-muted-foreground">
                        Receba um e-mail quando um presente for reservado.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Lembretes de eventos</div>
                      <div className="text-sm text-muted-foreground">Receba lembretes sobre seus eventos próximos.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Novidades e atualizações</div>
                      <div className="text-sm text-muted-foreground">
                        Receba informações sobre novos recursos e atualizações da plataforma.
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações no aplicativo</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Todas as atividades</div>
                      <div className="text-sm text-muted-foreground">
                        Receba notificações para todas as atividades relacionadas aos seus eventos.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Som de notificação</div>
                      <div className="text-sm text-muted-foreground">Ative o som para novas notificações.</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Salvar preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conta */}
        <TabsContent value="conta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>Gerencie as configurações da sua conta e preferências de idioma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Idioma e região</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select defaultValue="pt-BR">
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
                      <Select defaultValue="America/Sao_Paulo">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Selecione um fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-4)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacidade</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Perfil público</div>
                        <div className="text-sm text-muted-foreground">
                          Permitir que outros usuários vejam seu perfil.
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Compartilhar dados de uso</div>
                        <div className="text-sm text-muted-foreground">
                          Ajude-nos a melhorar compartilhando dados anônimos de uso.
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Zona de perigo</h3>
                  <div className="space-y-4">
                    <div className="rounded-md border border-destructive/50 p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-destructive">Excluir conta</div>
                        <div className="text-sm text-muted-foreground">
                          Excluir permanentemente sua conta e todos os seus dados. Esta ação não pode ser desfeita.
                        </div>
                        <Button variant="destructive" size="sm" className="mt-2">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir minha conta
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
