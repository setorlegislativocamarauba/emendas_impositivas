export interface Emenda {
  id: string;
  identificador: string; // e.g. "manilha1", "0"
  vereador: string;
  numero: string; // e.g. "1", "136 (nova)"
  palavraChave: string;
  area: string; // e.g. "Obras", "Saúde", "Agricultura, Ambiente e Mobilidade Urbana", "Governo", "Desenvolvimento Social", "Cultura, Turismo e Lazer"
  tipoDespesa: string; // e.g. "Obras e instalações", "Subvenção Social", "Custeio (materiais/serviços)", "Equipamento permanente", "Auxílio Financeiro"
  objeto: string; // detailed description
  programa: string;
  acao: string;
  fichaAnulacao: string;
  novaFicha: string;
  valorPrevisto: number;
  valorPrevistoFormatado: string;
  receitaCorrenteLiquida: number; // valor ajustado RCL
  receitaCorrenteLiquidaFormatada: string;
  temImpedimentoTecnico: boolean;
  razoesImpedimento: string;
  // Remanejamento columns:
  remanejamentoPalavraChave?: string;
  remanejamentoVereador?: string;
  remanejamentoNumero?: string;
  remanejamentoArea?: string;
  remanejamentoTipoDespesa?: string;
  remanejamentoObjeto?: string;
  remanejamentoPrograma?: string;
  remanejamentoAcao?: string;
  remanejamentoValor?: number;
  remanejamentoValorFormatado?: string;
  remanejamentoSaneamento?: string;
  confirmacaoExecucao?: string;
  emendaExecutada?: string; // Coluna AF: "Sim", "Não", "-", ou vazio
  isNovaEmenda: boolean;
  entidadeBeneficiada?: string;
}

export interface FiltrosState {
  palavraChave: string;
  balanco: string;
  numero: string;
  exercicio: string;
  modalidade: string;
  autor: string;
  area: string;
  tipoDespesa: string;
  situacao: string; // "todas" | "sem_impedimento" | "com_impedimento" | "remanejada"
  valorMin?: number;
  valorMax?: number;
}
