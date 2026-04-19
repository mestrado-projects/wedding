"use client";

import { Calendar, Hotel } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { AttendanceOptions } from "@/types/invite";

interface AttendanceSectionProps {
  options: AttendanceOptions;
  onOptionChange: (key: keyof AttendanceOptions, value: boolean) => void;
  error: string | null;
}

const ATTENDANCE_OPTIONS: Array<{
  key: keyof AttendanceOptions;
  label: string;
  description: string;
  icon: "calendar" | "hotel";
}> = [
  {
    key: "ceremony",
    label: "Cerimonia e festa",
    description: "Sabado, 29 de maio de 2027",
    icon: "calendar",
  },
  {
    key: "hotelFriday",
    label: "Hospedagem sexta para sabado",
    description: "Noite de 28 para 29 de maio",
    icon: "hotel",
  },
  {
    key: "hotelSaturday",
    label: "Hospedagem sabado para domingo",
    description: "Noite de 29 para 30 de maio",
    icon: "hotel",
  },
  {
    key: "hotelSunday",
    label: "Hospedagem domingo para segunda",
    description: "Noite de 30 para 31 de maio",
    icon: "hotel",
  },
];

export function AttendanceSection({
  options,
  onOptionChange,
  error,
}: AttendanceSectionProps) {
  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <div className="p-2 rounded-full bg-secondary/10">
          <Calendar className="size-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary">
            Intencao de participacao
          </h3>
          <p className="text-sm text-muted-foreground">
            Selecione as opcoes que se aplicam a todos os convidados selecionados
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {ATTENDANCE_OPTIONS.map((option) => {
          const Icon = option.icon === "calendar" ? Calendar : Hotel;
          const isChecked = options[option.key];

          return (
            <div
              key={option.key}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                isChecked
                  ? "bg-secondary/5 border-secondary/30"
                  : "bg-background/50 border-border/30 hover:bg-background/80"
              }`}
              onClick={() => onOptionChange(option.key, !isChecked)}
            >
              <Checkbox
                id={option.key}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  onOptionChange(option.key, checked as boolean)
                }
                className="size-5 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={option.key}
                  className="text-base font-medium text-primary cursor-pointer flex items-center gap-2"
                >
                  <Icon className="size-4 text-secondary/70" />
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-secondary text-center">
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center italic">
        Ao selecionar hospedagem de sabado ou domingo, a cerimonia sera marcada automaticamente.
      </p>
    </section>
  );
}
