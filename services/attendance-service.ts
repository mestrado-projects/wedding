import type { AttendanceIntentPayload } from "@/types/invite";

/**
 * Envia a intencao de comparecimento para o backend
 * @param payload - Dados da intencao de comparecimento
 * @returns Promise<void>
 */
export async function submitAttendanceIntent(
  payload: AttendanceIntentPayload
): Promise<void> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Log para desenvolvimento
  console.log("Intencao de comparecimento enviada:", payload);

  // Em producao, faria a chamada real:
  // const response = await fetch('/api/attendance', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Falha ao enviar');
}
