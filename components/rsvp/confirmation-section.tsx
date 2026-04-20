"use client";

import { Heart } from "lucide-react";

export function ConfirmationSection() {
  return (
    <section className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="inline-flex items-center justify-center p-4 rounded-full bg-secondary/10">
        <Heart className="size-10 text-secondary" fill="currentColor" />
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-4xl text-primary">
          Obrigado!
        </h2>
        <p className="font-serif text-xl text-primary">
          Recebemos sua resposta com carinho
        </p>
      </div>

      <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
        Agradecemos por nos ajudar com o planejamento.
        Em breve enviaremos o convite oficial com todos os detalhes.
      </p>

      <div className="pt-4">
        <p className="font-display text-3xl text-secondary">
          Yara & Gustavo
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          WEDDING IS COMMING
        </p>
      </div>
    </section>
  );
}
