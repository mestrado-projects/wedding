"use client";

import { Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Guest } from "@/types/invite";

interface GuestSelectionSectionProps {
  guests: Guest[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  error: string | null;
}

export function GuestSelectionSection({
  guests,
  selectedIds,
  onSelectionChange,
  error,
}: GuestSelectionSectionProps) {
  const toggleGuest = (guestId: string) => {
    if (selectedIds.includes(guestId)) {
      onSelectionChange(selectedIds.filter((id) => id !== guestId));
    } else {
      onSelectionChange([...selectedIds, guestId]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === guests.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(guests.map((g) => g.id));
    }
  };

  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <div className="p-2 rounded-full bg-secondary/10">
          <Users className="size-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary">
            Encontramos seu convite
          </h3>
          <p className="text-sm text-muted-foreground">
            Confirme quais pessoas pretendem participar
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {guests.length > 1 && (
          <div className="flex items-center gap-3 pb-3 border-b border-border/30">
            <Checkbox
              id="select-all"
              checked={selectedIds.length === guests.length}
              onCheckedChange={toggleAll}
              className="size-5"
            />
            <Label
              htmlFor="select-all"
              className="text-sm font-medium text-muted-foreground cursor-pointer"
            >
              Selecionar todos
            </Label>
          </div>
        )}

        {guests.map((guest) => (
          <div
            key={guest.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
            onClick={() => toggleGuest(guest.id)}
          >
            <Checkbox
              id={guest.id}
              checked={selectedIds.includes(guest.id)}
              onCheckedChange={() => toggleGuest(guest.id)}
              className="size-5"
            />
            <Label
              htmlFor={guest.id}
              className="text-base font-medium text-primary cursor-pointer flex-1"
            >
              {guest.name}
            </Label>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-secondary text-center">
          {error}
        </p>
      )}
    </section>
  );
}
