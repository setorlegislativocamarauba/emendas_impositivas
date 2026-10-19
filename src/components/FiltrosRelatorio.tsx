import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  X,
  Filter,
} from 'lucide-react';
import { FiltrosState } from '../types/emenda';

interface FiltrosRelatorioProps {
  filtros: FiltrosState;
  onFiltrosChange: (novosFiltros: FiltrosState) => void;
  onResetFiltros: () => void;
  autoresDisponiveis: string[];
  areasDisponiveis: string[];
  tiposDespesaDisponiveis: string[];
  totalResultados: number;
  totalGeral: number;
  onExportarCSV: () => void;
  onExportarExcel: () => void;
  onImprimirPDF: () => void;
}

export const FiltrosRelatorio: React.FC<FiltrosRelatorioProps> = ({
  filtros,
  onFiltrosChange,
  onResetFiltros,
  autoresDisponiveis,
  areasDisponiveis,
  tiposDespesaDisponiveis,
  totalResultados,
  totalGeral,
  onExportarCSV,
  onExportarExcel,
  onImprimirPDF,
}) => {
  const [isAvancadoAberto, setIsAvancadoAberto] = useState<boolean>(false);
  const [exportMenuOpen, setExportMenuOpen] = useState<boolean>(false);

  const handleInputChange = (field: keyof FiltrosState, value: string) => {
    onFiltrosChange({
      ...filtros,
      [field]: value,
    });
  };

  const removeFilterTag = (field: keyof FiltrosState) => {
    onFiltrosChange({
      ...filtros,
      [field]: '',
    });
  };

  const activeFiltersCount = Object.entries(filtros).filter(([key, val]) => {
    if (key === 'balanco' && !val) return false;
    return val && typeof val === 'string' && val.trim().length > 0;
  }).length;

  return (
    <div className="space-y-4 no-print">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Painel de Acompanhamento
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Emendas Impositivas | Relatório
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
            Acompanhe a destinação dos recursos públicos municipais através das emendas parlamentares impositivas
          </p>
        </div>

        {/* Export Button Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Relatório</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  onImprimirPDF();
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700 font-semibold"
              >
                <Printer className="w-4 h-4 text-blue-700" />
                <span>Imprimir / Salvar em PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExportarExcel();
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700 font-semibold"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Exportar Planilha Excel (.xls)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExportarCSV();
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700 font-semibold"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Exportar Arquivo CSV</span>
              </button>
              <hr className="my-1 border-slate-100" />
              <a
                href="./index-pronto.html"
                download="index.html"
                onClick={() => setExportMenuOpen(false)}
                className="w-full px-4 py-2.5 text-left hover:bg-emerald-50 flex items-center gap-2.5 cursor-pointer text-emerald-800 font-extrabold"
                title="Baixar apenas o arquivo index.html compilado pronto para substituir no GitHub"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Baixar index.html (Arquivo Único)</span>
              </a>
              <a
                href="./site-pronto-github-pages.zip"
                download="site-pronto-github-pages.zip"
                onClick={() => setExportMenuOpen(false)}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-700 font-semibold text-xs"
                title="Arquivos compilados em arquivo ZIP"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Site Pronto Completo (.zip)</span>
              </a>
              <a
                href="./emendas-impositivas-uba.zip"
                download="emendas-impositivas-uba.zip"
                onClick={() => setExportMenuOpen(false)}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer text-slate-600 font-medium text-xs"
                title="Código-fonte completo do projeto (TypeScript, Vite, React)"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Código-fonte Completo (.zip)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm sm:text-base">Filtrar Relatório</span>
              <p className="text-slate-500 text-xs">Use os campos abaixo para refinar os indicadores e a lista de emendas.</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            Exibindo <strong className="text-blue-700">{totalResultados}</strong> de <strong className="text-slate-700">{totalGeral}</strong> emendas
          </div>
        </div>

        {/* Main Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* Keyword Search */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Palavra-chave
              </span>
            </label>
            <input
              type="search"
              placeholder="Número, autor, entidade, bairro, manilha, asfalto..."
              value={filtros.palavraChave}
              onChange={(e) => handleInputChange('palavraChave', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Situação / Balanço */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Situação da Emenda
            </label>
            <select
              value={filtros.situacao}
              onChange={(e) => handleInputChange('situacao', e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50/70 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-700"
            >
              <option value="">Todas as situações</option>
              <option value="sem_impedimento">Sem Impedimento (Regular)</option>
              <option value="com_impedimento">Com Impedimento Técnico</option>
              <option value="remanejada">Com Remanejamento</option>
              <option value="novas">Apenas Emendas Novas</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onResetFiltros}
              disabled={activeFiltersCount === 0}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAvancadoAberto(!isAvancadoAberto)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer border ${
                isAvancadoAberto || activeFiltersCount > 1
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros ({activeFiltersCount})</span>
              {isAvancadoAberto ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Section */}
        {isAvancadoAberto && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-150">
            {/* Número */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número da Emenda
              </label>
              <input
                type="text"
                placeholder="Ex.: 1, 10, 136"
                value={filtros.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Autor / Vereador */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vereador(a) Proponente
              </label>
              <select
                value={filtros.autor}
                onChange={(e) => handleInputChange('autor', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                <option value="">Todos os parlamentares</option>
                {autoresDisponiveis.map((autor) => (
                  <option key={autor} value={autor}>
                    {autor}
                  </option>
                ))}
              </select>
            </div>

            {/* Área / Categoria */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Área Temática
              </label>
              <select
                value={filtros.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                <option value="">Todas as áreas</option>
                {areasDisponiveis.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Despesa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Despesa
              </label>
              <select
                value={filtros.tipoDespesa}
                onChange={(e) => handleInputChange('tipoDespesa', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              >
                <option value="">Todos os tipos</option>
                {tiposDespesaDisponiveis.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Badges */}
        {activeFiltersCount > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filtros ativos:
            </span>

            {filtros.palavraChave && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Texto: "{filtros.palavraChave}"
                <button onClick={() => removeFilterTag('palavraChave')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filtros.autor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Vereador: {filtros.autor}
                <button onClick={() => removeFilterTag('autor')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filtros.area && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Área: {filtros.area}
                <button onClick={() => removeFilterTag('area')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filtros.tipoDespesa && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Tipo: {filtros.tipoDespesa}
                <button onClick={() => removeFilterTag('tipoDespesa')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filtros.situacao && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Situação: {filtros.situacao.replace('_', ' ')}
                <button onClick={() => removeFilterTag('situacao')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filtros.numero && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                Nº: {filtros.numero}
                <button onClick={() => removeFilterTag('numero')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={onResetFiltros}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer ml-2"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
