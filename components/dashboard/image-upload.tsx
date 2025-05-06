"use client"

import React, { useState, useRef, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
}

export function ImageUpload({ value = null, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(value)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const { toast } = useToast()

  // Sincroniza o estado interno com o valor controlado pelo pai
  useEffect(() => {
    setFile(value)
  }, [value])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selected = e.target.files?.[0] ?? null
      setFile(selected)
      onChange(selected)
    } catch (error: any) {
      console.error("Erro ao selecionar imagem:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar imagem",
        description: error?.message || "Tente novamente mais tarde.",
      })
      setFile(null)
      onChange(null)
    }
  }

  // Gera o URL de preview sempre que o arquivo mudar
  useEffect(() => {
    // Se não tiver arquivo, limpa a preview
    if (!file) {
      setPreviewUrl("");
      return;
    }
  
    // Se for uma string (já é uma URL), só atribui diretamente
    if (typeof file === "string") {
      setPreviewUrl(file);
      return;
    }
  
    // Só cria ObjectURL para Blobs/Files
    if (file instanceof Blob) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
  
      // cleanup: revoga o URL quando o arquivo mudar ou componente desmontar
      return () => {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl("");
      };
    }
  
    // Qualquer outro tipo: não sabemos tratar, limpamos
    console.warn("Tipo de `file` não suportado para preview:", file);
    setPreviewUrl("");
  }, [file]);

  const clear = () => {
    setFile(null)
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Carregar imagem
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {file && (
          <Button type="button" variant="outline" size="icon" onClick={clear} className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {previewUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-md border">
          <img
            src={previewUrl}
            alt="Pré-visualização da imagem"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
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
