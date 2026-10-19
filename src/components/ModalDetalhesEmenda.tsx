import React from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Building2,
  Calendar,
  Layers,
  FileCode,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { Emenda } from '../types/emenda';
import { ParlamentarAvatar } from './ParlamentarAvatar';
import { findParlamentar } from '../utils/parlamentarService';

interface ModalDetalhesEmendaProps {
  emenda: Emenda | null;
  onClose: () => void;
}

export const ModalDetalhesEmenda: React.FC<ModalDetalhesEmendaProps> = ({ emenda, onClose }) => {
  if (!emenda) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ParlamentarAvatar
              nome={emenda.vereador}
              size="lg"
              showLinkToSapl
              className="border-2 border-white/70 shadow-md ring-2 ring-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Exercício Financeiro de 2026 • Emenda Impositiva
                </span>
                {emenda.isNovaEmenda && (
                  <span className="bg-cyan-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded">
                    NOVA
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black">Emenda N.º {emenda.numero}</h3>
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <span className="font-semibold">{emenda.vereador}</span>
                {(() => {
                  const info = findParlamentar(emenda.vereador);
                  if (!info?.saplUrl) return null;
                  return (
                    <a
                      href={info.saplUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-200 hover:text-white inline-flex items-center gap-0.5 text-[11px]"
                    >
                      SAPL <ArrowRight className="w-2.5 h-2.5 inline" />
                    </a>
                  );
                })()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Status & Values Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                Valor Previsto
              </span>
              <span className="text-xl font-black text-blue-900 block">
                {emenda.valorPrevistoFormatado}
              </span>
              <span className="text-[11px] text-blue-700">
                Receita Corrente Líquida: {emenda.receitaCorrenteLiquidaFormatada}
              </span>
            </div>

            <div
              className={`p-3.5 border rounded-xl flex items-center gap-3 ${
                emenda.temImpedimentoTecnico
                  ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              }`}
            >
              {emenda.temImpedimentoTecnico ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
              )}
              <div>
                <span className="text-xs font-black block uppercase tracking-wide">
                  {emenda.temImpedimentoTecnico ? 'Impedimento Técnico Registrado' : 'Sem Impedimento Técnico'}
                </span>
                <span className="text-[11px] opacity-90">
                  {emenda.temImpedimentoTecnico
                    ? 'Submetida a remanejamento ou saneamento'
                    : 'Aprovada e autorizada para cumprimento orçamentário'}
                </span>
              </div>
            </div>

            {emenda.emendaExecutada && emenda.emendaExecutada.trim() !== '' && (
              <div
                className={`p-3 border rounded-xl flex items-center justify-between sm:col-span-2 ${
                  emenda.emendaExecutada.trim().toLowerCase() === 'sim'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : emenda.emendaExecutada.trim().toLowerCase() === 'não'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                    Coluna AF • Planilha das Emendas
                  </span>
                  <strong className="text-sm font-black">
                    Emenda Executada: {emenda.emendaExecutada.trim()}
                  </strong>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    emenda.emendaExecutada.trim().toLowerCase() === 'sim'
                      ? 'bg-emerald-600 text-white'
                      : emenda.emendaExecutada.trim().toLowerCase() === 'não'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {emenda.emendaExecutada.trim()}
                </span>
              </div>
            )}
          </div>

          {/* Objeto da Emenda */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Objeto da Emenda (Descrição Completa)
            </label>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-medium">
              {emenda.objeto}
            </div>
          </div>

          {/* Classificação Orçamentária */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Classificação Orçamentária & Programática
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">ÁREA</span>
                <span className="font-semibold text-slate-800 truncate block">{emenda.area}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">DESPESA</span>
                <span className="font-semibold text-slate-800 truncate block">{emenda.tipoDespesa}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">PROGRAMA</span>
                <span className="font-mono font-bold text-slate-800">{emenda.programa || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">AÇÃO</span>
                <span className="font-mono font-bold text-slate-800">{emenda.acao || '---'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">FICHA DE ANULAÇÃO</span>
                <span className="font-mono font-bold text-slate-800">{emenda.fichaAnulacao || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">ENTIDADE BENEFICIADA</span>
                <span className="font-semibold text-slate-800 truncate block" title={emenda.entidadeBeneficiada || '---'}>
                  {emenda.entidadeBeneficiada || '---'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-bold">PALAVRA-CHAVE</span>
                <span className="font-semibold text-slate-800 truncate block" title={emenda.palavraChave && emenda.palavraChave !== '0' ? emenda.palavraChave : '---'}>
                  {emenda.palavraChave && emenda.palavraChave !== '0' ? emenda.palavraChave : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Parecer Técnico do Executivo (se houver impedimento) */}
          {emenda.temImpedimentoTecnico && (
            <div className="space-y-1.5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Razões Técnicas para o Impedimento
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-normal">
                {emenda.razoesImpedimento || 'Impedimento técnico registrado pelos órgãos competentes da Prefeitura.'}
              </p>
            </div>
          )}

          {/* Remanejamento / Saneamento (se houver) */}
          {(emenda.remanejamentoObjeto || emenda.remanejamentoValor) && (
            <div className="space-y-2 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs uppercase tracking-wide">
                <ArrowRight className="w-4 h-4 text-indigo-600" />
                Dados do Remanejamento / Destinação Corrigida
              </div>
              <div className="text-xs text-indigo-950 space-y-1 leading-relaxed">
                {emenda.remanejamentoObjeto && (
                  <p>
                    <strong>Novo Objeto / Ação:</strong> {emenda.remanejamentoObjeto}
                  </p>
                )}
                {emenda.remanejamentoValorFormatado && (
                  <p>
                    <strong>Valor Remanejado:</strong> {emenda.remanejamentoValorFormatado}
                  </p>
                )}
                {emenda.remanejamentoArea && (
                  <p>
                    <strong>Nova Área:</strong> {emenda.remanejamentoArea}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            <span>Imprimir Ficha</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
