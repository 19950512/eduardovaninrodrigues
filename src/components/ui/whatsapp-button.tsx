import { siteConfig } from "@/lib/config";

/**
 * Botão flutuante de WhatsApp, fixo em todas as páginas.
 * - Posição bottom/right, z-index alto para ficar acima de outros elementos.
 * - Mensagem inicial configurável em lib/config.ts.
 * - Animação pulsante discreta (respeitando prefers-reduced-motion via CSS global).
 * - No mobile, some o rótulo textual e mantém apenas o botão circular.
 */
export function WhatsAppButton() {
  const { numeroE164, mensagemPadrao } = siteConfig.whatsapp;
  const href = `https://wa.me/${numeroE164}?text=${encodeURIComponent(mensagemPadrao)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Conversar no WhatsApp com ${siteConfig.nomeExibicao}`}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none hidden rounded-full bg-ink/90 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block dark:bg-white/90 dark:text-ink">
        Fale pelo WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40 motion-reduce:animate-none"
          style={{ animationDuration: "2.5s" }}
        />
        <span
          aria-hidden="true"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </span>
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.412-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.05 2C6.554 2 2.1 6.454 2.1 11.95c0 1.87.508 3.622 1.393 5.13L2 22l5.045-1.462a9.906 9.906 0 0 0 5.005 1.363h.004c5.496 0 9.951-4.454 9.951-9.951C22 6.454 17.546 2 12.05 2zm0 18.13a8.15 8.15 0 0 1-4.152-1.136l-.298-.176-3.09.897.905-3.04-.194-.312a8.15 8.15 0 0 1-1.256-4.363c0-4.503 3.665-8.168 8.088-8.168 4.502 0 8.168 3.665 8.168 8.168 0 4.502-3.666 8.13-8.171 8.13z" />
    </svg>
  );
}
