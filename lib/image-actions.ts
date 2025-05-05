"use server"

// Simulação de upload de imagem
export async function uploadImage(file: File) {
  // Em uma aplicação real, faríamos o upload para um serviço de armazenamento
  // como AWS S3, Cloudinary, Vercel Blob, etc.

  // Simulando um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Retornando uma URL de placeholder
  const query = encodeURIComponent(file.name.split(".")[0] || "event")
  return `/placeholder.svg?height=800&width=1200&query=${query}`
}
