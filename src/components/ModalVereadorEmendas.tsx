import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  Download,
  Search,
  AlertTriangle,
  ExternalLink,
  FileText,
  Eye,
  Check,
  Loader2,
} from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';
import { exportVereadorPDF } from '../utils/pdfExportService';
import { useCamaraLogo } from '../utils/logoManager';
import { ParlamentarAvatar } from './ParlamentarAvatar';
import { findParlamentar } from '../utils/parlamentarService';

interface ModalVereadorEmendasProps {
  vereadorNome: string | null;
  emendas: Emenda[];
  onClose: () => void;
  onOpenDetalhesEmenda?: (emenda: Emenda) => void;
}

export const ModalVereadorEmendas: React.FC<ModalVereadorEmendasProps> = ({
  vereadorNome,
  emendas,
  onClose,
  onOpenDetalhesEmenda,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroArea, setFiltroArea] = useState<'todas' | 'saude' | 'outras'>('todas');
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const { logo: camaraLogo } = useCamaraLogo();

  // Filter amendments belonging to this council member
  const emendasDoVereador = useMemo(() => {
    if (!vereadorNome) return [];
    return emendas.filter((e) => e.vereador === vereadorNome);
  }, [emendas, vereadorNome]);

  // Calculations for KPI summary
  const metricas = useMemo(() => {
    let totalPrevisto = 0;
    let totalSaude = 0;
    let countOrig = 0;
    let countRem = 0;
    let comImpedimento = 0;
    const entidadesSet = new Set<string>();

    emendasDoVereador.forEach((e) => {
      if (!e.isNovaEmenda) {
        totalPrevisto += e.valorPrevisto;
        countOrig += 1;
      } else {
        countRem += 1;
      }

      if (e.area.toLowerCase().includes('saúde') || e.area.toLowerCase().includes('saude')) {
        totalSaude += e.valorPrevisto;
      }

      if (e.entidadeBeneficiada && e.entidadeBeneficiada.trim()) {
        entidadesSet.add(e.entidadeBeneficiada.trim());
      }

      if (e.temImpedimentoTecnico) {
        comImpedimento += 1;
      }
    });

    const percentualSaude = totalPrevisto > 0 ? (totalSaude / totalPrevisto) * 100 : 0;

    return {
      totalPrevisto,
      totalSaude,
      percentualSaude,
      countOrig,
      countRem,
      totalEmendas: emendasDoVereador.length,
      comImpedimento,
      totalEntidades: entidadesSet.size,
    };
  }, [emendasDoVereador]);

  // Filtered by search & area
  const emendasFiltradas = useMemo(() => {
    return emendasDoVereador.filter((e) => {
      // Area filter
      const isSaude = e.area.toLowerCase().includes('saúde') || e.area.toLowerCase().includes('saude');
      if (filtroArea === 'saude' && !isSaude) return false;
      if (filtroArea === 'outras' && isSaude) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const textToMatch = `${e.numero} ${e.area} ${e.tipoDespesa} ${e.objeto} ${e.entidadeBeneficiada || ''} ${e.palavraChave || ''} ${e.razoesImpedimento || ''}`.toLowerCase();
        if (!textToMatch.includes(query)) return false;
      }

      return true;
    });
  }, [emendasDoVereador, filtroArea, searchTerm]);

  // Keyboard navigation: Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!vereadorNome) return null;

  const parlamentarInfo = findParlamentar(vereadorNome);
  const metaSaudeAtingida = metricas.percentualSaude >= 50;

  // Print & Save PDF function: directly creates & downloads official PDF and opens browser print dialog
  const handlePrint = async () => {
    if (!vereadorNome) return;
    setPdfStatus('generating');

    try {
      // 1. Instantly generate and trigger download of the official PDF
      exportVereadorPDF(vereadorNome, emendasDoVereador, {
        totalPrevisto: metricas.totalPrevisto,
        totalSaude: metricas.totalSaude,
        percentualSaude: metricas.percentualSaude,
        totalEmendas: metricas.totalEmendas,
        comImpedimento: metricas.comImpedimento,
      });

      // 2. Also trigger standard window.print for physical printing / system dialog
      try {
        document.body.classList.add('printing-modal-vereador');
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-modal-vereador');
        }, 1000);
      } catch {
        // window.print might be restricted in sandboxed iframe, but PDF is already downloaded!
      }

      setPdfStatus('success');
      setTimeout(() => {
        setPdfStatus('idle');
      }, 3500);
    } catch (err) {
      console.error('Erro ao gerar PDF do vereador:', err);
      try {
        window.print();
      } catch {
        // Ignore
      }
      setPdfStatus('idle');
    }
  };

  // Export functions
  const handleExportExcel = () => {
    const safeName = vereadorNome.toLowerCase().replace(/[^a-z0-9]/g, '-');
    exportToExcel(emendasDoVereador, `emendas-2026-${safeName}.xls`);
  };

  const handleExportCSV = () => {
    const safeName = vereadorNome.toLowerCase().replace(/[^a-z0-9]/g, '-');
    exportToCSV(emendasDoVereador, `emendas-2026-${safeName}.csv`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto modal-backdrop-wrapper"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 modal-vereador-card my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shrink-0 border-b border-blue-950">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <ParlamentarAvatar
                nome={vereadorNome}
                size="lg"
                className="ring-4 ring-white/20 border-2 border-white shadow-lg shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 rounded">
                    Câmara Municipal de Ubá • Exercício Financeiro de 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {vereadorNome}
                </h2>
                <div className="flex items-center gap-3 text-xs text-blue-100/90 mt-1">
                  <span>Cota Constitucional: <strong>{formatCurrency(metricas.totalPrevisto)}</strong></span>
                  {parlamentarInfo?.saplUrl && (
                    <a
                      href={parlamentarInfo.saplUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 hover:text-white underline font-medium"
                      title="Abrir perfil oficial no Sistema de Apoio ao Processo Legislativo (SAPL)"
                    >
                      Perfil Oficial no SAPL <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Fechar janela (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick KPI Summary Bar - 3 Columns */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Destinado
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
              {formatCurrency(metricas.totalPrevisto)}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Saúde (Mín. 50%)
            </span>
            <div className="mt-0.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatCurrency(metricas.totalSaude)}
              </span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Qtd. de Emendas
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 block mt-0.5">
              {metricas.totalEmendas} emendas
            </span>
          </div>
        </div>

        {/* Action Toolbar: Filter, Search & Download/Print Buttons */}
        <div className="p-4 sm:px-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Search within council member's amendments */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por entidade, n.º ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Area filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setFiltroArea('todas')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filtroArea === 'todas' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({metricas.totalEmendas})
            </button>
            <button
              onClick={() => setFiltroArea('saude')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                filtroArea === 'saude' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Saúde
            </button>
            <button
              onClick={() => setFiltroArea('outras')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filtroArea === 'outras' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demais Áreas
            </button>
          </div>

          {/* Export & Print actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              disabled={pdfStatus === 'generating'}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                pdfStatus === 'success'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
              title="Salvar relatório oficial em PDF e abrir impressão"
            >
              {pdfStatus === 'generating' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : pdfStatus === 'success' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>PDF Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              title="Baixar planilha Excel com todas as colunas (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Baixar arquivo CSV (.csv)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Scrollable Amendments List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
          {emendasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhuma emenda encontrada</p>
              <p className="text-xs text-slate-500 mt-1">
                Tente ajustar os termos de pesquisa ou o filtro de área.
              </p>
            </div>
          ) : (
            emendasFiltradas.map((emenda, idx) => {
              const isSaude = emenda.area.toLowerCase().includes('saúde') || emenda.area.toLowerCase().includes('saude');
              return (
                <div
                  key={emenda.id || `${emenda.numero}-${idx}`}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow space-y-3"
                >
                  {/* Top line of card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-lg shadow-2xs">
                        Emenda N.º {emenda.numero}
                      </span>
                      {emenda.isNovaEmenda && (
                        <span className="text-[10px] font-black uppercase bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                          Nova / Remanejada
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isSaude
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {emenda.area}
                      </span>
                      {emenda.tipoDespesa && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {emenda.tipoDespesa}
                        </span>
                      )}
                      {emenda.emendaExecutada && emenda.emendaExecutada.trim() !== '' && emenda.emendaExecutada.trim() !== '-' && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            emenda.emendaExecutada.trim().toLowerCase() === 'sim'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : emenda.emendaExecutada.trim().toLowerCase() === 'não'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          Executada: {emenda.emendaExecutada.trim()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Valor Previsto
                        </span>
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {emenda.valorPrevistoFormatado}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary Entity (Clean, without icon as requested in print 5) */}
                  {emenda.entidadeBeneficiada && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Entidade / Órgão Beneficiário:
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                        {emenda.entidadeBeneficiada}
                      </strong>
                    </div>
                  )}

                  {/* Detailed Description / Objeto */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                      Objeto e Finalidade da Destinação:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {emenda.objeto || 'Não especificado na planilha orçamentária.'}
                    </p>
                  </div>

                  {/* Impediment or Remanejamento Notes if present */}
                  {emenda.temImpedimentoTecnico && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Impedimento Técnico Registrado:</strong>{' '}
                        {emenda.razoesImpedimento || 'Emenda com restrição técnica ou remanejamento de dotação.'}
                      </div>
                    </div>
                  )}

                  {emenda.remanejamentoObjeto && (
                    <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-lg text-xs text-cyan-900">
                      <span className="font-bold">Destino no Remanejamento:</span> {emenda.remanejamentoObjeto}
                      {emenda.remanejamentoValorFormatado && (
                        <span className="ml-2 font-mono font-bold">({emenda.remanejamentoValorFormatado})</span>
                      )}
                    </div>
                  )}

                  {/* Bottom details & action */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      {emenda.programa && (
                        <span>Programa: <strong className="text-slate-700">{emenda.programa}</strong></span>
                      )}
                      {emenda.fichaAnulacao && (
                        <span>Ficha: <strong className="text-slate-700">{emenda.fichaAnulacao}</strong></span>
                      )}
                      {emenda.palavraChave && emenda.palavraChave !== '0' && (
                        <span className="hidden md:inline text-slate-400 italic">
                          ref: {emenda.palavraChave}
                        </span>
                      )}
                    </div>

                    {onOpenDetalhesEmenda && (
                      <button
                        onClick={() => onOpenDetalhesEmenda(emenda)}
                        className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 p-1 hover:underline cursor-pointer"
                        title="Ver ficha técnica completa da emenda"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Ficha Técnica</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-slate-500">
          <div>
            Exibindo <strong>{emendasFiltradas.length}</strong> de <strong>{metricas.totalEmendas}</strong> emendas do parlamentar
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Official Print Layout (Printed only during window.print()) */}
      <div id="print-modal-content" className="print-modal-vereador-view print-only p-8 bg-white text-black font-sans">
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={camaraLogo}
                alt="Brasão da Câmara Municipal de Ubá"
                className="w-16 h-16 object-contain shrink-0"
              />
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                  Câmara Municipal de Ubá • Minas Gerais
                </p>
                <h1 className="text-xl font-black uppercase text-slate-900 mt-0.5">
                  Emendas Parlamentares Impositivas
                </h1>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  Exercício Financeiro de 2026 • Lei Orçamentária Anual
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono block">Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
              <span className="text-xs text-slate-500">{new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>

          {/* Parlamentar Summary */}
          <div className="mt-4 p-3 bg-slate-100 rounded-lg border border-slate-300 grid grid-cols-4 gap-2 text-xs">
            <div>
              <span className="font-bold block text-slate-600">PARLAMENTAR:</span>
              <span className="text-sm font-black text-slate-900">{vereadorNome}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-600">COTA TOTAL:</span>
              <span className="text-sm font-black text-slate-900">{formatCurrency(metricas.totalPrevisto)}</span>
            </div>
            <div>
              <span className="font-bold block text-slate-600">DESTINAÇÃO SAÚDE:</span>
              <span className="text-sm font-black text-emerald-800">
                {formatCurrency(metricas.totalSaude)} ({metricas.percentualSaude.toFixed(1)}%)
              </span>
            </div>
            <div>
              <span className="font-bold block text-slate-600">TOTAL DE EMENDAS:</span>
              <span className="text-sm font-black text-slate-900">
                {metricas.totalEmendas} emendas {metricas.comImpedimento > 0 && <span className="text-red-700">({metricas.comImpedimento} c/ impedimento)</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Print Table */}
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-200 text-slate-900 font-bold border-b-2 border-slate-800">
              <th className="p-2 text-center w-16">N.º</th>
              <th className="p-2 text-left w-36">Área</th>
              <th className="p-2 text-left">Objeto / Finalidade</th>
              <th className="p-2 text-right w-28">Valor (R$)</th>
              <th className="p-2 text-center w-28">Emenda Executada</th>
            </tr>
          </thead>
          <tbody>
            {emendasDoVereador.map((e, i) => (
              <tr key={i} className="border-b border-slate-300">
                <td className="p-2 text-center font-bold">{e.numero}</td>
                <td className="p-2 font-medium">{e.area}</td>
                <td className="p-2 text-[11px] leading-snug">{e.objeto}</td>
                <td className="p-2 text-right font-mono font-bold whitespace-nowrap">
                  {e.valorPrevistoFormatado}
                </td>
                <td className="p-2 text-center font-bold">
                  {e.emendaExecutada && e.emendaExecutada.trim() !== '-' && e.emendaExecutada.trim() !== '' ? (
                    <span
                      className={
                        e.emendaExecutada.trim().toLowerCase() === 'sim'
                          ? 'text-emerald-700 font-bold'
                          : e.emendaExecutada.trim().toLowerCase() === 'não'
                          ? 'text-rose-700 font-bold'
                          : 'text-slate-700'
                      }
                    >
                      {e.emendaExecutada.trim()}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-800">
              <td colSpan={3} className="p-2 text-right">TOTAL DESTINADO:</td>
              <td className="p-2 text-right font-mono font-black">{formatCurrency(metricas.totalPrevisto)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {/* Footer print note */}
        <div className="mt-6 pt-3 border-t border-slate-400 flex items-center justify-between text-[10px] text-slate-600">
          <span>Portal de Transparência das Emendas Parlamentares Impositivas • Câmara Municipal de Ubá - MG</span>
          <span>Página 1 de 1</span>
        </div>
      </div>
    </div>
  );
};
