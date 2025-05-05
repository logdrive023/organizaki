"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/image-actions"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Em uma aplicação real, faríamos o upload para um serviço de armazenamento
      // Aqui, simulamos o upload retornando uma URL de placeholder
      const url = await uploadImage(file)
      onChange(url)
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Enviando..." : "Carregar imagem"}
        </Button>
        <input id="image-upload" type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        {value && (
          <Button type="button" variant="outline" size="icon" onClick={() => onChange("")} className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {value && (
        <div className="relative aspect-video overflow-hidden rounded-md border">
          <Image src={value || "/placeholder.svg"} alt="Imagem do evento" fill className="object-cover" />
        </div>
      )}

      {!value && (
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
          </div>
        </div>
      )}
    </div>
  )
}
