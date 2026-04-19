"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchSection } from "./search-section";
import { GuestSelectionSection } from "./guest-selection-section";
import { AttendanceSection } from "./attendance-section";
import { SummarySection } from "./summary-section";
import { ConfirmationSection } from "./confirmation-section";
import { searchInvite } from "@/services/invite-service";
import { submitAttendanceIntent } from "@/services/attendance-service";
import {
  applyAttendanceRules,
  hasAnyAttendanceOption,
  getInitialAttendanceOptions,
} from "@/utils/attendance-rules";
import type { InviteResponse, AttendanceOptions } from "@/types/invite";

export function SaveTheDateIntentPage() {
  // Estado da busca
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteResponse | null>(null);

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

  // Handler de busca
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    setInvite(null);
    setSelectedGuestIds([]);
    setAttendanceOptions(getInitialAttendanceOptions());

    try {
      const result = await searchInvite(query);
      if (result) {
        setInvite(result);
      } else {
        setSearchError(
          "Nao encontramos um convite com esses dados. Confira o nome ou telefone informado."
        );
      }
    } catch {
      setSearchError("Ocorreu um erro ao buscar. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
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
      setAttendanceError("Selecione pelo menos uma opcao de participacao.");
      return;
    }

    if (!invite) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitAttendanceIntent({
        inviteId: invite.inviteId,
        selectedGuestIds,
        attendanceIntent: attendanceOptions,
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [invite, selectedGuestIds, attendanceOptions]);

  // Condicoes para exibir cada secao
  const showGuestSelection = invite !== null;
  const showAttendance = showGuestSelection && selectedGuestIds.length > 0;
  const showSummary =
    showAttendance && hasAnyAttendanceOption(attendanceOptions);

  // Se ja enviou, mostra apenas confirmacao
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-lg border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-10">
            <ConfirmationSection />
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
              error={attendanceError}
            />
          )}

          {/* Etapa 4: Resumo e envio */}
          {showSummary && invite && (
            <SummarySection
              guests={invite.guests}
              selectedGuestIds={selectedGuestIds}
              attendance={attendanceOptions}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              error={submitError}
            />
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Feito com amor para o nosso grande dia
        </p>
      </footer>
    </div>
  );
}
