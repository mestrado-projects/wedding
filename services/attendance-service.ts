import type { AttendanceIntentPayload } from "@/types/invite";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

export async function submitAttendanceIntent(
  payload: AttendanceIntentPayload
): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    throw new Error("NEXT_PUBLIC_APPS_SCRIPT_URL não configurada.");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  let result: { success?: boolean; error?: string } = {};

  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Resposta inválida do Apps Script.");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Falha ao enviar resposta.");
  }
}