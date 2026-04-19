import type { AttendanceOptions } from "@/types/invite";

/**
 * Aplica as regras de dependencia entre opcoes de comparecimento.
 * 
 * Regras:
 * - Domingo implica sabado e cerimonia
 * - Sabado implica cerimonia
 * - Sexta NAO implica cerimonia (regra de negocio especifica)
 */
export function applyAttendanceRules(
  currentOptions: AttendanceOptions,
  changedKey: keyof AttendanceOptions,
  newValue: boolean
): AttendanceOptions {
  const updated = { ...currentOptions, [changedKey]: newValue };

  // Regras de marcacao automatica (quando marca uma opcao)
  if (newValue) {
    // Domingo implica sabado e cerimonia
    if (changedKey === "hotelSunday") {
      updated.hotelSaturday = true;
      updated.ceremony = true;
    }
    // Sabado implica cerimonia
    if (changedKey === "hotelSaturday") {
      updated.ceremony = true;
    }
  }

  // Regras de desmarcacao automatica (quando desmarca uma opcao)
  if (!newValue) {
    // Se desmarcar cerimonia, desmarcar sabado e domingo (mas nao sexta)
    if (changedKey === "ceremony") {
      updated.hotelSaturday = false;
      updated.hotelSunday = false;
    }
    // Se desmarcar sabado, desmarcar domingo
    if (changedKey === "hotelSaturday") {
      updated.hotelSunday = false;
    }
  }

  return updated;
}

/**
 * Verifica se pelo menos uma opcao de comparecimento esta marcada
 */
export function hasAnyAttendanceOption(options: AttendanceOptions): boolean {
  return Object.values(options).some(Boolean);
}

/**
 * Retorna as opcoes iniciais (todas desmarcadas)
 */
export function getInitialAttendanceOptions(): AttendanceOptions {
  return {
    ceremony: false,
    hotelFriday: false,
    hotelSaturday: false,
    hotelSunday: false,
  };
}
