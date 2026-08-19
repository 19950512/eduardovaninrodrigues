import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade",
  description:
    "Política de privacidade e tratamento de dados pessoais do site de Eduardo Vanin Rodrigues, em conformidade com a LGPD.",
  path: "/politica-de-privacidade",
  noIndex: false,
});

const secoes = [
  {
    titulo: "1. Dados coletados",
    conteudo: [
      "Ao utilizar o formulário de contato deste site, coletamos os dados fornecidos voluntariamente: nome, e-mail, telefone (quando informado), assunto e mensagem.",
      "Não solicitamos, e o usuário não deve enviar, dados sigilosos ou informações específicas de processos judiciais em andamento através do formulário de contato.",
      "O site também pode coletar dados técnicos de navegação de forma agregada e não identificável, com finalidade de manutenção e segurança.",
    ],
  },
  {
    titulo: "2. Finalidade do tratamento",
    conteudo: [
      "Os dados fornecidos no formulário de contato são utilizados exclusivamente para viabilizar o retorno ao interessado e o eventual agendamento de atendimento profissional.",
      "Não realizamos venda, cessão ou compartilhamento de dados pessoais com terceiros para fins de marketing.",
    ],
  },
  {
    titulo: "3. Formulários",
    conteudo: [
      "O envio de dados pelo formulário de contato é uma escolha voluntária do usuário. Ao enviar o formulário, o usuário consente com o tratamento dos dados informados para a finalidade descrita nesta política.",
      "O usuário pode, a qualquer momento, solicitar a exclusão dos dados fornecidos, entrando em contato pelos canais informados na página de Contato.",
    ],
  },
  {
    titulo: "4. Cookies",
    conteudo: [
      "Este site utiliza um mecanismo local de armazenamento apenas para lembrar a preferência de tema (claro ou escuro) escolhida pelo usuário. Essa informação é armazenada no próprio navegador do usuário e não é compartilhada com terceiros.",
      "Não utilizamos cookies de rastreamento publicitário neste site.",
    ],
  },
  {
    titulo: "5. Serviços de terceiros",
    conteudo: [
      "O site pode utilizar serviços de hospedagem e infraestrutura de terceiros (como a Vercel) para seu funcionamento técnico. Esses serviços podem processar dados técnicos de acesso conforme suas próprias políticas de privacidade.",
      "Links para redes sociais oficiais podem direcionar o usuário a plataformas de terceiros, que possuem suas próprias políticas de privacidade.",
    ],
  },
  {
    titulo: "6. Direitos do titular dos dados",
    conteudo: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD), o titular dos dados tem direito a confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou desatualizados, solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, e revogar o consentimento a qualquer momento.",
      `Para exercer esses direitos, entre em contato através do e-mail ${siteConfig.email} ou dos demais canais informados na página de Contato.`,
    ],
  },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", path: "/" },
          { label: "Política de Privacidade", path: "/politica-de-privacidade" },
        ]}
      />

      <section className="pb-20 pt-4 lg:pb-28">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            LGPD
          </p>
          <h1 className="font-display mt-3 text-balance text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-5 text-sm text-foreground-muted">
            Última atualização: agosto de 2026.
          </p>

          <div className="mt-10 space-y-10">
            {secoes.map((secao) => (
              <div key={secao.titulo}>
                <h2 className="font-display text-xl font-medium text-foreground">
                  {secao.titulo}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground-muted">
                  {secao.conteudo.map((paragrafo, index) => (
                    <p key={index}>{paragrafo}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
