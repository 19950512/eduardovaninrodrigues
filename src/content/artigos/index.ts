import type { Artigo } from "./types";

/**
 * Registro de artigos — 1 arquivo por post neste diretório.
 *
 * COMO O AGENTE PUBLICA UM ARTIGO NOVO (automatizado, via PR):
 *   1. cria  src/content/artigos/<slug>.ts  exportando `const artigo: Artigo`
 *   2. insere UMA linha de import logo após a âncora "AGENT-IMPORTS:INICIO"
 *   3. insere UMA linha com o nome da constante após "AGENT-REGISTRO:INICIO"
 *
 * As âncoras abaixo são pontos de inserção determinísticos — NÃO as remova
 * nem altere o texto delas. A ordem de inserção não importa: a lista é
 * ordenada por data (mais recente primeiro) na exportação final.
 */

// AGENT-IMPORTS:INICIO
import { artigo as oQueEOPrincipioDaInsignificanciaNoDireitoPenal } from "./o-que-e-o-principio-da-insignificancia-no-direito-penal";
import { artigo as prisaoEmFlagranteDireitosDoPreso } from "./prisao-em-flagrante-direitos-do-preso";
import { artigo as audienciaDeCustodiaComoFunciona } from "./audiencia-de-custodia-como-funciona";
import { artigo as diferencaEntreInqueritoEProcessoPenal } from "./diferenca-entre-inquerito-e-processo-penal";
// AGENT-IMPORTS:FIM

const registro: Artigo[] = [
  // AGENT-REGISTRO:INICIO
  oQueEOPrincipioDaInsignificanciaNoDireitoPenal,
  prisaoEmFlagranteDireitosDoPreso,
  audienciaDeCustodiaComoFunciona,
  diferencaEntreInqueritoEProcessoPenal,
  // AGENT-REGISTRO:FIM
];

export const artigos: Artigo[] = [...registro].sort((a, b) =>
  a.data < b.data ? 1 : a.data > b.data ? -1 : 0,
);
