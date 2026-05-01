"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchSection } from "./search-section";
import { DisambiguationSection } from "./disambiguation-section";
import { GuestSelectionSection } from "./guest-selection-section";
import { AttendanceSection } from "./attendance-section";
import { SummarySection } from "./summary-section";
import { ConfirmationSection } from "./confirmation-section";
import { searchInvite, getInviteById } from "@/services/invite-service";
import { submitAttendanceIntent } from "@/services/attendance-service";
import { HotelInfoDialog } from "./hotel-info-dialog";
import {
  applyAttendanceRules,
  hasAnyAttendanceOption,
  getInitialAttendanceOptions,
} from "@/utils/attendance-rules";
import type { InviteResponse, InviteSearchResult, AttendanceOptions } from "@/types/invite";
import { CalendarX } from "lucide-react";

// Data limite para confirmacao de presenca: 02/08/2026
const RSVP_DEADLINE = new Date("2026-08-02T23:59:59");

export function SaveTheDateIntentPage() {
   // Verifica se o prazo de confirmacao expirou
  const isDeadlineExpired = useMemo(() => {
    return new Date() > RSVP_DEADLINE;
  }, []);

  // Estado da busca
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteResponse | null>(null);
  const [originalQuery, setOriginalQuery] = useState("");

  // Estado de desambiguacao (multiplos matches)
  const [multipleMatches, setMultipleMatches] = useState<
    Array<{ inviteId: string; inviteName: string; group: string }> | null
  >(null);

  // Estado da selecao de convidados
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [guestError, setGuestError] = useState<string | null>(null);

  // Estado das opcoes de comparecimento
  const [attendanceOptions, setAttendanceOptions] = useState<AttendanceOptions>(
    getInitialAttendanceOptions()
  );
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  // Estado do envio
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Estado de endereco e telefone para envio dos convites
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [isHotelInfoOpen, setIsHotelInfoOpen] = useState(false);

  const handleAttendanceAction = useCallback((action: "openHotelInfo") => {
    if (action === "openHotelInfo") {
      setIsHotelInfoOpen(true);
    }
  }, []);

  // Reseta todos os estados para nova busca
  const resetState = useCallback(() => {
    setInvite(null);
    setMultipleMatches(null);
    setSelectedGuestIds([]);
    setAttendanceOptions(getInitialAttendanceOptions());
    setGuestError(null);
    setAttendanceError(null);
    setSubmitError(null);
  }, []);

  // Handler de busca
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setOriginalQuery(query);
    resetState();

    try {
      const result: InviteSearchResult | null = await searchInvite(query);
      
      if (!result) {
        setSearchError(
          "Nao encontramos um convite com esses dados. Basta colocar o primeiro nome, a forma que falamos com voce, ou tente pelo seu telefone."
        );
        return;
      }
      
      if (result.type === "single" && result.invite) {
        setInvite(result.invite);
      } else if (result.type === "multiple" && result.matches) {
        setMultipleMatches(result.matches);
      }
    } catch {
      setSearchError("Ocorreu um erro ao buscar. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  }, [resetState]);

  // Handler para selecionar convite da lista de desambiguacao
  const handleSelectInvite = useCallback(async (inviteId: string) => {
    setIsSearching(true);
    setMultipleMatches(null);

    try {
      const result = await getInviteById(inviteId);
      if (result) {
        setInvite(result);
      } else {
        setSearchError("Convite nao encontrado. Tente novamente.");
      }
    } catch {
      setSearchError("Ocorreu um erro ao buscar o convite. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handler para refinar busca
  const handleRefineSearch = useCallback(() => {
    setMultipleMatches(null);
  }, []);

  // Handler de selecao de convidados
  const handleGuestSelection = useCallback((ids: string[]) => {
    setSelectedGuestIds(ids);
    setGuestError(null);
  }, []);

  // Handler de opcoes de comparecimento
  const handleAttendanceChange = useCallback(
    (key: keyof AttendanceOptions, value: boolean) => {
      setAttendanceOptions((prev) => applyAttendanceRules(prev, key, value));
      setAttendanceError(null);
    },
    []
  );

  // Handler de envio
  const handleSubmit = useCallback(async () => {
    // Validacoes
    if (selectedGuestIds.length === 0) {
      setGuestError("Selecione ao menos uma pessoa do convite.");
      return;
    }

    if (!hasAnyAttendanceOption(attendanceOptions)) {
      setAttendanceError("Selecione pelo menos uma opcao de participação.");
      return;
    }

    if (!invite) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const selectedGuests = invite.guests.filter((guest) =>
        selectedGuestIds.includes(guest.id)
      );

      await submitAttendanceIntent({
        inviteId: invite.inviteId,
        inviteName: invite.inviteName,
        group: invite.group,
        selectedGuestIds,
        selectedGuestNames: selectedGuests.map((guest) => guest.name),
        attendanceIntent: attendanceOptions,
        address,
        phone,
        source: "save-the-date-web",
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [invite, selectedGuestIds, attendanceOptions, address, phone]);

  // Condicoes para exibir cada secao
  const showDisambiguation = multipleMatches !== null && multipleMatches.length > 0;
  const showGuestSelection = invite !== null;
  const showAttendance = showGuestSelection && selectedGuestIds.length > 0;
  const hasDeclined = attendanceOptions.declined;
  const hasConfirmedAttendance = hasAnyAttendanceOption(attendanceOptions) && !hasDeclined;
  const showContactInfo = showAttendance && hasConfirmedAttendance;
  const hasContactInfo = address.trim() !== "" && phone.trim() !== "";
  const showSummary = showContactInfo && hasContactInfo;

  // Se o prazo expirou, mostra mensagem informativa
  if (isDeadlineExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-10">
            <section className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted">
                <CalendarX className="size-10 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-4xl text-primary">
                  Prazo Encerrado
                </h2>
                <p className="font-serif text-xl text-primary">
                  O prazo para confirmacao de presenca foi encerrado
                </p>
              </div>

              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                O prazo para confirmar presenca era ate o dia 02 de agosto de 2026. 
                Se voce ainda precisa confirmar, entre em contato diretamente com os noivos.
              </p>

              <div className="pt-4">
                <p className="font-display text-3xl text-secondary">
                  Yara & Gustavo
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  29, 30 e 31 de maio de 2027
                </p>
                <p className="font-serif text-lg text-secondary underline">
                  <a target="_blank" href="https://maps.app.goo.gl/bi8Tc2exCACr92Tq6">RN - Praia De Camurupim, N: 1680 - Orla, Nísia Floresta</a>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se ja enviou, mostra apenas confirmacao
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-10">
            <ConfirmationSection declined={attendanceOptions.declined} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-background">
      {/* Header decorativo */}
      <header className="text-center mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Save the Weekend
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-primary">
          Yara & Gustavo
        </h1>
        <p className="font-serif text-lg text-secondary">
          29, 30 e 31 de maio de 2027
        </p>
        <p className="font-serif text-lg text-secondary underline">
          <a target="_blank" href="https://maps.app.goo.gl/bi8Tc2exCACr92Tq6">RN - Praia De Camurupim, N: 1680 - Orla, Nísia Floresta</a>
        </p>
      </header>

      {/* Card principal */}
      <Card className="w-full max-w-lg border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-8">
          {/* Etapa 1: Busca */}
          <SearchSection
            onSearch={handleSearch}
            isLoading={isSearching}
            error={searchError}
          />

          {/* Etapa 1.5: Desambiguacao (multiplos resultados) */}
          {showDisambiguation && (
            <DisambiguationSection
              matches={multipleMatches}
              onSelectInvite={handleSelectInvite}
              onRefineSearch={handleRefineSearch}
              originalQuery={originalQuery}
            />
          )}

          {/* Etapa 2: Selecao de convidados */}
          {showGuestSelection && invite && (
            <GuestSelectionSection
              guests={invite.guests}
              selectedIds={selectedGuestIds}
              onSelectionChange={handleGuestSelection}
              error={guestError}
            />
          )}

          {/* Etapa 3: Opcoes de comparecimento */}
          {showAttendance && (
            <AttendanceSection
              options={attendanceOptions}
              onOptionChange={handleAttendanceChange}
              onActionClick={handleAttendanceAction}
              error={attendanceError}
            />
          )}

          {/* Etapa 3.5: Endereco e telefone para envio dos convites */}
          {showContactInfo && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-primary">
                  Dados para envio do convite
                </h3>
                <p className="text-sm text-muted-foreground">
                  Informe o endereco completo (como voce colocaria nos Correios) e um telefone para contato.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-primary">
                    Endereco completo
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, numero, complemento, bairro, cidade, estado e CEP"
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border/40 bg-background text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-primary">
                    Telefone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full h-10 px-3 rounded-md border border-border/40 bg-background text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Etapa 4: Resumo e envio */}
          {showSummary && invite && (
            <SummarySection
              guests={invite.guests}
              selectedGuestIds={selectedGuestIds}
              attendance={attendanceOptions}
              address={address}
              phone={phone}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              error={submitError}
            />
          )}
           {/* Envio direto quando recusar presenca */}
          {showAttendance && hasDeclined && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-muted-foreground text-center">
                Sentiremos sua falta, mas agradecemos por nos avisar.
              </p>

              {submitError && (
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm text-secondary text-center">
                    {submitError}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar resposta"
                )}
              </button>
            </section>
          )}
        </CardContent>
      </Card>

      {/* Aviso de prazo limite */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Confirme sua presenca ate 02 de agosto de 2026
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Feito com amor para o nosso grande dia
        </p>
      </footer>
      
      <HotelInfoDialog
        open={isHotelInfoOpen}
        onOpenChange={setIsHotelInfoOpen}
      />
    </div>
  );
}
