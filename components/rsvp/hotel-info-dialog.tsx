"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2, MapPin, BedDouble } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type HotelImage = {
  src: string;
  alt: string;
};

interface HotelInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HotelInfoDialog({
  open,
  onOpenChange,
}: HotelInfoDialogProps) {
  const [images, setImages] = useState<HotelImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    async function loadImages() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/hotel-images");
        const data = (await response.json()) as { images?: HotelImage[] };

        if (isMounted) {
          setImages(data.images ?? []);
        }
      } catch {
        if (isMounted) {
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-serif text-2xl text-primary">
            Um pouquinho sobre o hotel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Carregando imagens...
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="px-10">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.src}>
                      <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                        <AspectRatio ratio={16 / 10}>
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                        </AspectRatio>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="left-2 border-border/60 bg-background/90" />
                <CarouselNext className="right-2 border-border/60 bg-background/90" />
              </Carousel>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              Nenhuma imagem encontrada em <strong>public/hotel</strong>.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}