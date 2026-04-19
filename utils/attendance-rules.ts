import type { AttendanceOptions } from "@/types/invite";

/**
 * Aplica as regras de dependência entre opções de comparecimento.
 * 
 * Evento: Save the Weekend
 * - Sábado 29/05: Cerimônia e festa
 * - Domingo 30/05: Dia de lazer
 * - Segunda 31/05: Checkout
 * 
 * Regras:
 * - Recusa desmarca todas as outras opções
 * - Qualquer opção de presença desmarca a recusa
 * - Domingo implica sábado e cerimônia (precisa estar no sábado para ficar domingo)
 * - Sábado implica cerimônia (vai dormir depois da festa)
 */
export function applyAttendanceRules(
  currentOptions: AttendanceOptions,
  changedKey: keyof AttendanceOptions,
  newValue: boolean
): AttendanceOptions {
  const updated = { ...currentOptions, [changedKey]: newValue };

  // Se marcou "não consigo comparecer", desmarca todas as outras
  if (changedKey === "declined" && newValue) {
    return {
      declined: true,
      ceremony: false,
      hotelSaturday: false,
      hotelSunday: false,
    };
  }

  // Se marcou qualquer opção de presença, desmarca a recusa
  if (changedKey !== "declined" && newValue) {
    updated.declined = false;
  }

  // Regras de marcação automática (quando marca uma opção)
  if (newValue) {
    // Domingo implica sábado e cerimônia
    if (changedKey === "hotelSunday") {
      updated.hotelSaturday = true;
      updated.ceremony = true;
    }
    // Sábado implica cerimônia
    if (changedKey === "hotelSaturday") {
      updated.ceremony = true;
    }
  }

  // Regras de desmarcação automática (quando desmarca uma opção)
  if (!newValue) {
    // Se desmarcar cerimônia, desmarcar sábado e domingo
    if (changedKey === "ceremony") {
      updated.hotelSaturday = false;
      updated.hotelSunday = false;
    }
    // Se desmarcar sábado, desmarcar domingo
    if (changedKey === "hotelSaturday") {
      updated.hotelSunday = false;
    }
  }

  return updated;
}

/**
 * Verifica se pelo menos uma opção de comparecimento está marcada
 * (incluindo a opção de recusa)
 */
export function hasAnyAttendanceOption(options: AttendanceOptions): boolean {
  return Object.values(options).some(Boolean);
}

/**
 * Verifica se o convidado recusou a presença
 */
export function hasDeclined(options: AttendanceOptions): boolean {
  return options.declined;
}

/**
 * Retorna as opções iniciais (todas desmarcadas)
 */
export function getInitialAttendanceOptions(): AttendanceOptions {
  return {
    declined: false,
    ceremony: false,
    hotelSaturday: false,
    hotelSunday: false,
  };
}
