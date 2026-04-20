"use client";

import { Calendar, Hotel, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { AttendanceOptions } from "@/types/invite";

interface AttendanceSectionProps {
  options: AttendanceOptions;
  onOptionChange: (key: keyof AttendanceOptions, value: boolean) => void;
  onActionClick?: (action: "openHotelInfo") => void;
  error: string | null;
}

type AttendanceOptionAction = {
  label: string;
  action: "openHotelInfo";
};

const ATTENDANCE_OPTIONS: Array<{
  key: keyof AttendanceOptions;
  label: string;
  description: string;
  actions?: AttendanceOptionAction[];
  icon: "calendar" | "hotel" | "decline";
}> = [
  {
    key: "declined",
    label: "Não consigo comparecer",
    description: "Ficaremos tristes com sua ausência, mas entendemos que o deslocamento pode ser complexo.",
    icon: "decline",
  },
  {
    key: "ceremony",
    label: "Cerimônia e festa",
    description: "Sábado, 29 de maio de 2027",
    icon: "calendar",
  },
  {
    key: "hotelSaturday",
    label: "Hospedagem sábado para domingo",
    description: "",
    actions: [
      {
        label: "Ver detalhes do hotel",
        action: "openHotelInfo",
      },
    ],
    icon: "hotel",
  },
  {
    key: "hotelSunday",
    label: "Hospedagem domingo para segunda",
    description: "Checkout até as 12h",
    icon: "hotel",
  },
];

export function AttendanceSection({
  options,
  onOptionChange,
  onActionClick,
  error,
}: AttendanceSectionProps) {
  const IconMap = {
    calendar: Calendar,
    hotel: Hotel,
    decline: XCircle,
  };

  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <div className="p-2 rounded-full bg-secondary/10">
          <Calendar className="size-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary">
            Conta pra gente se você pode comparecer
          </h3>
          <p className="text-sm text-muted-foreground">
            As opções que se aplicam a todos os convidados selecionados
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {ATTENDANCE_OPTIONS.map((option, index) => {
          const Icon = IconMap[option.icon];
          const isChecked = options[option.key];
          const isDeclineOption = option.key === "declined";

          return (
            <div key={option.key}>
              {/* Separador visual entre recusa e opções de presença */}
              {index === 1 && (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    ou confirme presença
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
              )}
              <div
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  isChecked
                    ? isDeclineOption
                      ? "bg-muted/50 border-muted-foreground/30"
                      : "bg-secondary/5 border-secondary/30"
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
                    className={`text-base font-medium cursor-pointer flex items-center gap-2 ${
                      isDeclineOption ? "text-muted-foreground" : "text-primary"
                    }`}
                  >
                    <Icon className={`size-4 ${isDeclineOption ? "text-muted-foreground/70" : "text-secondary/70"}`} />
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  )}

                  {option.actions && option.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {option.actions.map((action) => (
                        <button
                          key={`${option.key}-${action.action}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onActionClick?.(action.action);
                          }}
                          className="text-sm text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

    </section>
  );
}
