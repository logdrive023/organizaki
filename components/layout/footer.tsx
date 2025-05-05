import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Receba nossas novidades</h3>
              <p className="text-muted-foreground">
                Inscreva-se para receber dicas de organização de eventos e novidades da plataforma.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Seu melhor e-mail" className="flex-1" />
              <Button className="sm:w-auto">Inscrever</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold">
              <Image
                src="/placeholder.svg?key=39fft"
                alt="Organizaki Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-xl">Organizaki</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Plataforma completa para organização de eventos como casamentos, aniversários e chás de bebê. Tudo o que
              você precisa em um só lugar.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-funciona"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/#funcionalidades"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="/#beneficios"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Benefícios
                </Link>
              </li>
              <li>
                <Link
                  href="/evento/demo"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Demonstração
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold mb-4">Informações Legais</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Ajuda e Suporte
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground text-sm">Av. Paulista, 1000, São Paulo - SP, 01310-100</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm">(11) 3000-1000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-muted-foreground" />
                <span className="text-muted-foreground text-sm">contato@organizaki.com.br</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">© 2025 Organizaki. Todos os direitos reservados.</div>
          <div className="flex items-center text-sm text-muted-foreground">
            Feito com <Heart size={14} className="mx-1 text-red-500" /> no Brasil
          </div>
        </div>
      </div>
    </footer>
  )
}
