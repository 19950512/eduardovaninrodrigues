"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { enviarContato, type ContatoFormState } from "@/app/contato/actions";

const estadoInicial: ContatoFormState = { status: "idle" };

function BotaoEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? "Enviando..." : "Enviar mensagem"}
    </button>
  );
}

const campoClasse =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/70 focus:border-primary";

export function ContactForm() {
  const [estado, formAction] = useActionState(enviarContato, estadoInicial);
  // Marca o instante em que o formulário foi renderizado no navegador do
  // usuário. O servidor rejeita envios enviados rápido demais depois desse
  // instante — um preenchimento humano leva no mínimo alguns segundos,
  // enquanto bots costumam enviar o POST quase instantaneamente.
  const [iniciadoEm] = useState(() => Date.now());

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="iniciadoEm" value={iniciadoEm} />

      {/* Honeypot — invisível para usuários reais, ajuda a filtrar bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa">Não preencher este campo</label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="text-sm font-medium text-foreground">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            className={`${campoClasse} mt-2`}
            aria-invalid={Boolean(estado.errors?.nome)}
            aria-describedby={estado.errors?.nome ? "erro-nome" : undefined}
          />
          {estado.errors?.nome && (
            <p id="erro-nome" className="mt-1.5 text-xs text-primary">
              {estado.errors.nome}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${campoClasse} mt-2`}
            aria-invalid={Boolean(estado.errors?.email)}
            aria-describedby={estado.errors?.email ? "erro-email" : undefined}
          />
          {estado.errors?.email && (
            <p id="erro-email" className="mt-1.5 text-xs text-primary">
              {estado.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="telefone" className="text-sm font-medium text-foreground">
            Telefone (opcional)
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            autoComplete="tel"
            className={`${campoClasse} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="assunto" className="text-sm font-medium text-foreground">
            Assunto
          </label>
          <input
            id="assunto"
            name="assunto"
            type="text"
            required
            className={`${campoClasse} mt-2`}
            aria-invalid={Boolean(estado.errors?.assunto)}
            aria-describedby={estado.errors?.assunto ? "erro-assunto" : undefined}
          />
          {estado.errors?.assunto && (
            <p id="erro-assunto" className="mt-1.5 text-xs text-primary">
              {estado.errors.assunto}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="text-sm font-medium text-foreground">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          maxLength={2000}
          className={`${campoClasse} mt-2 resize-none`}
          aria-invalid={Boolean(estado.errors?.mensagem)}
          aria-describedby="aviso-confidencialidade erro-mensagem"
        />
        {estado.errors?.mensagem && (
          <p id="erro-mensagem" className="mt-1.5 text-xs text-primary">
            {estado.errors.mensagem}
          </p>
        )}
      </div>

      <p
        id="aviso-confidencialidade"
        className="flex items-start gap-2.5 rounded-xl border border-border bg-background-subtle px-4 py-3 text-xs leading-relaxed text-foreground-muted"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        Por segurança, não inclua nesta mensagem dados sigilosos ou detalhes
        específicos de processos em andamento (número de processo, provas,
        estratégia de defesa). Esses assuntos devem ser tratados diretamente
        em atendimento.
      </p>

      {estado.status !== "idle" && (
        <div
          role="status"
          className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm ${
            estado.status === "success"
              ? "bg-primary/10 text-primary"
              : "bg-primary/10 text-primary"
          }`}
        >
          {estado.status === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {estado.message}
        </div>
      )}

      <BotaoEnviar />
    </form>
  );
}
