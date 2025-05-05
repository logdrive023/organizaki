"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  responsive?: boolean
  className?: string
}

export function AdBanner({ slot, format = "auto", responsive = true, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Verifica se o AdSense já está carregado
    if (typeof window !== "undefined" && adRef.current && adRef.current.innerHTML === "") {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense error:", error)
      }
    }
  }, [])

  // Determina a altura com base no formato
  const getHeight = () => {
    switch (format) {
      case "horizontal":
        return "h-24"
      case "vertical":
        return "h-96"
      case "rectangle":
        return "h-64"
      default:
        return "h-32"
    }
  }

  return (
    <div
      ref={adRef}
      className={`ad-container overflow-hidden text-center border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center ${getHeight()} ${className}`}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 font-medium text-lg">Publicidade vai aqui</p>
        <p className="text-gray-400 text-sm">Formato: {format}</p>
        <p className="text-gray-400 text-xs">Slot: {slot}</p>
      </div>
      <ins
        className="adsbygoogle hidden"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Substitua pelo seu ID de cliente
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  )
}
