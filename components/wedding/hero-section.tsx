"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calculateTimeLeft(): TimeLeft {
  const weddingDate = new Date("2027-05-29T00:00:00")
  const now = new Date()
  const difference = weddingDate.getTime() - now.getTime()

  if (difference <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  }

  return {
    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((difference / 1000 / 60) % 60),
    segundos: Math.floor((difference / 1000) % 60),
  }
}

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-primary/10 rounded-full" />
        <div className="absolute top-1/3 right-20 w-24 h-24 border border-secondary/10 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <p className="font-serif text-lg md:text-xl tracking-[0.3em] uppercase text-secondary mb-8">
          Vamos nos casar
        </p>

        <h1 className="text-6xl md:text-8xl lg:text-9xl text-primary mb-6" style={{ fontFamily: "var(--font-display)" }}>
          <span className="block">Yara</span>
          <span className="font-serif text-2xl md:text-3xl text-secondary tracking-widest">&</span>
          <span className="block">Gustavo</span>
        </h1>

        <div className="w-32 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto my-10" />

        <p className="font-serif text-2xl md:text-3xl text-primary mb-2">
          29 de Maio de 2027
        </p>

        {/* Countdown */}
        <div className="mt-12 grid grid-cols-4 gap-4 md:gap-8 max-w-lg mx-auto">
          {mounted && Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 md:p-6 backdrop-blur-sm">
                <span className="text-3xl md:text-5xl font-serif text-primary">
                  {String(value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs md:text-sm uppercase tracking-wider text-secondary mt-2 block">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <a 
            href="#rsvp" 
            className="inline-block px-8 py-4 bg-primary text-primary-foreground font-sans uppercase tracking-widest text-sm hover:bg-secondary transition-colors duration-300"
          >
            Confirmar Presenca
          </a>
        </div>
      </div>
    </section>
  )
}
