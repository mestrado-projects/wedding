"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DisambiguationMatch {
  inviteId: string;
  inviteName: string;
  group: string;
}

interface DisambiguationSectionProps {
  matches: DisambiguationMatch[];
  onSelectInvite: (inviteId: string) => void;
  onRefineSearch: () => void;
  originalQuery: string;
}

export function DisambiguationSection({
  matches,
  onSelectInvite,
  onRefineSearch,
  originalQuery,
}: DisambiguationSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
        <AlertCircle className="size-5 text-secondary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">
            Encontramos mais de um resultado para &ldquo;{originalQuery}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground">
            Selecione o convite correto abaixo ou refine sua busca com o telefone ou sobrenome.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <button
            key={match.inviteId}
            onClick={() => onSelectInvite(match.inviteId)}
            className="w-full p-4 text-left rounded-lg border border-border/60 bg-background/50 hover:bg-muted/50 hover:border-secondary/40 transition-colors"
          >
            <p className="font-serif text-base text-primary">{match.inviteName}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{match.group}</p>
          </button>
        ))}
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={onRefineSearch}
          className="w-full"
        >
          Refinar busca
        </Button>
      </div>
    </section>
  );
}
