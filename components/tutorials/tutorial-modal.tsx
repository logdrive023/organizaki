"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export type TutorialStep = {
  title: string
  content: string
  image?: string
}

export type TutorialContent = {
  id: string
  title: string
  steps: TutorialStep[]
}

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  tutorial: TutorialContent
}

export function TutorialModal({ isOpen, onClose, tutorial }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = tutorial.steps.length

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    onClose()
  }

  const step = tutorial.steps[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-primary">
            {tutorial.title} - Passo {currentStep + 1} de {totalSteps}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} >
          </Button>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <h3 className="text-lg font-medium">{step.title}</h3>

          {step.image && (
            <div className="relative h-64 w-full overflow-hidden rounded-md border">
              <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-muted-foreground">{step.content}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(currentStep === 0 && "opacity-50")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={cn("h-2 w-2 rounded-full", index === currentStep ? "bg-primary" : "bg-gray-200")}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentStep === totalSteps - 1}
              className={cn(currentStep === totalSteps - 1 && "opacity-50")}
            >
              Próximo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
