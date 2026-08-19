"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { FotoGaleria } from "@/content/galeria";

export function GalleryGrid({ fotos }: { fotos: FotoGaleria[] }) {
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null);

  const fechar = useCallback(() => setIndiceAberto(null), []);
  const anterior = useCallback(
    () =>
      setIndiceAberto((atual) =>
        atual === null ? null : (atual - 1 + fotos.length) % fotos.length,
      ),
    [fotos.length],
  );
  const proxima = useCallback(
    () =>
      setIndiceAberto((atual) =>
        atual === null ? null : (atual + 1) % fotos.length,
      ),
    [fotos.length],
  );

  useEffect(() => {
    if (indiceAberto === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") fechar();
      if (event.key === "ArrowLeft") anterior();
      if (event.key === "ArrowRight") proxima();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [indiceAberto, fechar, anterior, proxima]);

  const fotoAtual = indiceAberto === null ? null : fotos[indiceAberto];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {fotos.map((foto, index) => (
          <button
            key={foto.slug}
            type="button"
            onClick={() => setIndiceAberto(index)}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink text-left"
            aria-label={`Abrir foto ampliada: ${foto.alt}`}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {fotoAtual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fotoAtual.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar galeria"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={anterior}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative aspect-[3/4] max-h-[85vh] w-full max-w-md">
            <Image
              src={fotoAtual.src}
              alt={fotoAtual.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={proxima}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <p className="absolute bottom-6 left-1/2 max-w-lg -translate-x-1/2 text-center text-xs text-white/70">
            {fotoAtual.alt}
          </p>
        </div>
      )}
    </>
  );
}
