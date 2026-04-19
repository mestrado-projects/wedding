import type { InviteResponse, InviteSearchResult, SearchQuery } from "@/types/invite";
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
 * Extrai os ultimos 5 digitos de um telefone
 */
function extractLast5Digits(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.slice(-5);
}

/**
 * Normaliza a query de busca
 */
function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[\s\-()]/g, "");
}

/**
 * Verifica se a query parece ser um telefone (mais de 4 digitos numericos)
 */
function isPhoneQuery(query: string): boolean {
  const digitsOnly = query.replace(/\D/g, "");
  return digitsOnly.length >= 5;
}

/**
 * Encontra todos os convites que correspondem a query
 */
function findAllMatches(query: string): MockInvite[] {
  const normalizedQuery = normalizeQuery(query);
  const invites = mockData.invites as MockInvite[];
  const matches: MockInvite[] = [];
  
  // Se parece telefone, busca pelos ultimos 5 digitos
  if (isPhoneQuery(query)) {
    const last5 = extractLast5Digits(query);
    
    for (const invite of invites) {
      const phoneMatch = invite.searchTerms.some((term) => {
        // Se o termo e numerico, compara com os ultimos 5 digitos
        if (/^\d+$/.test(term)) {
          return term === last5 || term.endsWith(last5);
        }
        return false;
      });
      
      if (phoneMatch) {
        matches.push(invite);
      }
    }
    
    // Se encontrou por telefone, retorna
    if (matches.length > 0) {
      return matches;
    }
  }
  
  // Busca por nome/termo
  for (const invite of invites) {
    // Busca exata por searchTerms (match exato)
    const exactMatch = invite.searchTerms.some((term) => {
      const normalizedTerm = normalizeQuery(term);
      return normalizedTerm === normalizedQuery;
    });
    
    if (exactMatch) {
      matches.push(invite);
      continue;
    }
    
    // Busca por nome de convidado (match exato com primeiro nome ou nome completo)
    const guestMatch = invite.guests.some((guest) => {
      const normalizedName = normalizeQuery(guest.name);
      const nameParts = guest.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/);
      // Match exato com nome completo ou primeiro nome
      return normalizedName === normalizedQuery || nameParts[0] === normalizedQuery;
    });
    
    if (guestMatch) {
      matches.push(invite);
    }
  }
  
  return matches;
}

/**
 * Busca um convite pelo nome ou telefone
 * Retorna resultado unico ou multiplos matches para desambiguacao
 */
export async function searchInvite(query: string): Promise<InviteSearchResult | null> {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 600));

  const matches = findAllMatches(query);
  
  if (matches.length === 0) {
    return null;
  }
  
  if (matches.length === 1) {
    const invite = matches[0];
    return {
      type: "single",
      invite: {
        inviteId: invite.inviteId,
        inviteName: invite.inviteName,
        group: invite.group,
        guests: invite.guests.map((g) => ({
          id: g.id,
          name: g.name,
          gender: g.gender,
          ageGroup: g.ageGroup,
        })),
      },
    };
  }
  
  // Multiplos matches - precisa desambiguacao
  return {
    type: "multiple",
    matches: matches.map((invite) => ({
      inviteId: invite.inviteId,
      inviteName: invite.inviteName,
      group: invite.group,
    })),
  };
}

/**
 * Busca um convite especifico pelo ID
 */
export async function getInviteById(inviteId: string): Promise<InviteResponse | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const invites = mockData.invites as MockInvite[];
  const invite = invites.find((inv) => inv.inviteId === inviteId);
  
  if (!invite) {
    return null;
  }
  
  return {
    inviteId: invite.inviteId,
    inviteName: invite.inviteName,
    group: invite.group,
    guests: invite.guests.map((g) => ({
      id: g.id,
      name: g.name,
      gender: g.gender,
      ageGroup: g.ageGroup,
    })),
  };
}

/**
 * Prepara o payload para busca no backend real
 */
export function prepareSearchPayload(query: string): SearchQuery {
  const queryType = detectQueryType(query);
  
  // Se for telefone, envia apenas os ultimos 5 digitos
  if (queryType === "phone") {
    return {
      query: extractLast5Digits(query),
      queryType: "phone",
    };
  }
  
  return {
    query: query.trim(),
    queryType: "name",
  };
}
