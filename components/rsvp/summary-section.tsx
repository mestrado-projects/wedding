"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Guest, AttendanceOptions } from "@/types/invite";

interface SummarySectionProps {
  guests: Guest[];
  selectedGuestIds: string[];
  attendance: AttendanceOptions;
  address: string;
  phone: string;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ATTENDANCE_LABELS: Record<keyof AttendanceOptions, string> = {
  declined: "Não consigo comparecer",
  ceremony: "Cerimônia e festa",
  hotelSaturday: "Hospedagem sábado para domingo",
  hotelSunday: "Hospedagem domingo para segunda",
};

export function SummarySection({
  guests,
  selectedGuestIds,
  attendance,
  address,
  phone,
  onSubmit,
  isLoading,
  error,
}: SummarySectionProps) {
  const selectedGuests = guests.filter((g) => selectedGuestIds.includes(g.id));
  const selectedOptions = (Object.keys(attendance) as Array<keyof AttendanceOptions>)
    .filter((key) => attendance[key]);

  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <div className="p-2 rounded-full bg-secondary/10">
          <CheckCircle2 className="size-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary">
            Resumo da sua resposta
          </h3>
          <p className="text-sm text-muted-foreground">
            Confira os dados antes de enviar
          </p>
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-background/50 border border-border/30">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Convidados confirmados
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedGuests.map((guest) => (
              <span
                key={guest.id}
                className="px-3 py-1 rounded-full bg-secondary/10 text-primary text-sm font-medium"
              >
                {guest.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Endereco:</span>
            <p className="text-sm text-primary whitespace-pre-wrap">{address}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Telefone:</span>
            <p className="text-sm text-primary">{phone}</p>
          </div>
        </div>

        <div className="border-t border-border/30 pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Participação
          </h4>
          <ul className="space-y-1">
            {selectedOptions.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="size-4 text-secondary" />
                {ATTENDANCE_LABELS[key]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-sm text-secondary text-center">
            {error}
          </p>
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Confirmar resposta"
        )}
      </Button>
    </section>
  );
}
