"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"

export function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "yes",
    guests: "1",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-24 px-6 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-background border border-primary/20 rounded-lg p-12">
            <h2 className="text-4xl md:text-5xl text-primary mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Obrigado!
            </h2>
            <p className="font-serif text-lg text-primary/80">
              Sua presenca foi confirmada com sucesso. Mal podemos esperar para celebrar este momento especial com voce!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-24 px-6 bg-primary/5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-serif text-lg tracking-[0.3em] uppercase text-secondary mb-4">
            Confirmacao de Presenca
          </p>
          <h2 className="text-5xl md:text-6xl text-primary mb-6" style={{ fontFamily: "var(--font-display)" }}>
            RSVP
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="bg-background border border-primary/20 rounded-lg p-8 md:p-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-serif text-primary">
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-primary/20 bg-transparent focus:border-secondary focus:ring-secondary"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-serif text-primary">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-primary/20 bg-transparent focus:border-secondary focus:ring-secondary"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-4">
              <Label className="font-serif text-primary">
                Voce podera comparecer?
              </Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="border-primary text-primary" />
                  <Label htmlFor="yes" className="font-sans text-primary cursor-pointer">
                    Sim, estarei presente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="border-primary text-primary" />
                  <Label htmlFor="no" className="font-sans text-primary cursor-pointer">
                    Infelizmente nao poderei
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.attendance === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="guests" className="font-serif text-primary">
                  Numero de convidados (incluindo voce)
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="border-primary/20 bg-transparent focus:border-secondary focus:ring-secondary w-24"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="message" className="font-serif text-primary">
                Deixe uma mensagem para os noivos (opcional)
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="border-primary/20 bg-transparent focus:border-secondary focus:ring-secondary min-h-[120px] resize-none"
                placeholder="Suas palavras de carinho..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary uppercase tracking-widest py-6 font-sans"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Enviando...
                </span>
              ) : (
                "Confirmar Presenca"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
