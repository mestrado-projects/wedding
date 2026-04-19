import type { InviteResponse, SearchQuery } from "@/types/invite";
import { detectQueryType } from "@/utils/detect-query-type";

// Mock data para desenvolvimento
const MOCK_INVITES: Record<string, InviteResponse> = {
  "yara": {
    inviteId: "inv-001",
    guests: [
      { id: "g-001", name: "Yara" },
      { id: "g-002", name: "Carlos" },
    ],
  },
  "gustavo": {
    inviteId: "inv-002",
    guests: [
      { id: "g-003", name: "Gustavo" },
      { id: "g-004", name: "Ana" },
      { id: "g-005", name: "Pedro" },
    ],
  },
  "maria": {
    inviteId: "inv-003",
    guests: [
      { id: "g-006", name: "Maria" },
      { id: "g-007", name: "Joao" },
    ],
  },
  "11999887766": {
    inviteId: "inv-001",
    guests: [
      { id: "g-001", name: "Yara" },
      { id: "g-002", name: "Carlos" },
    ],
  },
};

/**
 * Busca um convite pelo nome ou telefone
 * @param query - Nome ou telefone do convidado
 * @returns Promise com o convite encontrado ou null
 */
export async function searchInvite(query: string): Promise<InviteResponse | null> {
  const queryType = detectQueryType(query);
  const normalizedQuery = query.toLowerCase().trim();
  
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Busca no mock
  const invite = MOCK_INVITES[normalizedQuery];
  
  if (invite) {
    return invite;
  }

  // Busca parcial por nome
  if (queryType === "name") {
    for (const [key, value] of Object.entries(MOCK_INVITES)) {
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        return value;
      }
    }
  }

  return null;
}

/**
 * Prepara o payload para busca no backend real
 */
export function prepareSearchPayload(query: string): SearchQuery {
  return {
    query: query.trim(),
    queryType: detectQueryType(query),
  };
}
