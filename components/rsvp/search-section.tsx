"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchSectionProps {
  onSearch: (query: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function SearchSection({ onSearch, isLoading, error }: SearchSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await onSearch(query.trim());
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-2xl text-primary">
          Confirme sua presenca
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
          Esta resposta nos ajuda a planejar o casamento e a hospedagem com carinho.
          Nao substitui a confirmacao oficial, que enviaremos em breve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Digite seu nome ou telefone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-4 pr-12 text-base bg-background/50 border-border/60 focus:border-secondary focus:ring-secondary/30"
            disabled={isLoading}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
        </div>

        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="w-full h-11 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Buscando...
            </>
          ) : (
            "Buscar convite"
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-sm text-secondary text-center">
            {error}
          </p>
        </div>
      )}
    </section>
  );
}
