import type { InviteResponse, SearchQuery } from "@/types/invite";
import { detectQueryType } from "@/utils/detect-query-type";
import mockData from "@/data/mock-invites.json";

type MockInvite = {
  inviteId: string;
  inviteName: string;
  group: string;
  phone?: string;
  searchTerms: string[];
  guests: Array<{
    id: string;
    name: string;
    gender: "M" | "F";
    ageGroup: "Adulto" | "Adolescente" | "Criança de colo";
  }>;
};

/**
 * Busca um convite pelo nome ou telefone
 * @param query - Nome ou telefone do convidado
 * @returns Promise com o convite encontrado ou null
 */
export async function searchInvite(query: string): Promise<InviteResponse | null> {
  const normalizedQuery = query.toLowerCase().trim().replace(/[\s\-()]/g, "");
  
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Busca no mock
  const invites = mockData.invites as MockInvite[];
  
  // Busca exata por searchTerms
  const exactMatch = invites.find((invite) =>
    invite.searchTerms.some((term) => term.toLowerCase() === normalizedQuery)
  );
  
  if (exactMatch) {
    return {
      inviteId: exactMatch.inviteId,
      inviteName: exactMatch.inviteName,
      group: exactMatch.group,
      guests: exactMatch.guests.map((g) => ({
        id: g.id,
        name: g.name,
        gender: g.gender,
        ageGroup: g.ageGroup,
      })),
    };
  }

  // Busca parcial por searchTerms
  const partialMatch = invites.find((invite) =>
    invite.searchTerms.some(
      (term) =>
        term.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(term.toLowerCase())
    )
  );

  if (partialMatch) {
    return {
      inviteId: partialMatch.inviteId,
      inviteName: partialMatch.inviteName,
      group: partialMatch.group,
      guests: partialMatch.guests.map((g) => ({
        id: g.id,
        name: g.name,
        gender: g.gender,
        ageGroup: g.ageGroup,
      })),
    };
  }

  // Busca por nome de convidado
  const guestMatch = invites.find((invite) =>
    invite.guests.some((guest) =>
      guest.name.toLowerCase().includes(normalizedQuery)
    )
  );

  if (guestMatch) {
    return {
      inviteId: guestMatch.inviteId,
      inviteName: guestMatch.inviteName,
      group: guestMatch.group,
      guests: guestMatch.guests.map((g) => ({
        id: g.id,
        name: g.name,
        gender: g.gender,
        ageGroup: g.ageGroup,
      })),
    };
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
