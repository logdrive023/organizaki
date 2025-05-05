import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, MoreHorizontal, Clock, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EventType } from "@/lib/types"

interface EventCardProps {
  event: EventType
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.coverImage || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Status Badge */}
        <Badge variant={event.status === "active" ? "default" : "secondary"} className="absolute left-3 top-3">
          {event.status === "active" ? "Ativo" : "Rascunho"}
        </Badge>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/eventos/${event.id}`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/evento/${event.id}`} target="_blank" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                <span>Visualizar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Event Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="line-clamp-1 text-lg font-bold">{event.title}</h3>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
            <span className="text-muted-foreground">•</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.guestCount} convidado{event.guestCount !== 1 && "s"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button asChild className="w-full">
          <Link href={`/dashboard/eventos/${event.id}`}>Gerenciar Evento</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
