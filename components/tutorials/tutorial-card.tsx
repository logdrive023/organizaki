"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type TutorialContent, TutorialModal } from "./tutorial-modal"

interface TutorialCardProps {
  tutorial: TutorialContent
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{tutorial.title}</CardTitle>
          <CardDescription>{tutorial.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{tutorial.description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(true)}>
            Ver tutorial
          </Button>
        </CardFooter>
      </Card>

      <TutorialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tutorial={tutorial} />
    </>
  )
}
