import React, { useState } from 'react';
import {
  Search,
  LayoutList,
  LayoutGrid,
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';
import { ParlamentarAvatar } from './ParlamentarAvatar';

interface TabelaEmendasProps {
  emendas: Emenda[];
  onOpenDetalhes: (emenda: Emenda) => void;
}

export const TabelaEmendas: React.FC<TabelaEmendasProps> = ({ emendas, onOpenDetalhes }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'numero' | 'valor' | 'vereador' | 'area'>('numero');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // Filter with local search
  const filtered = emendas.filter((e) => {
    if (!localSearch.trim()) return true;
    const term = localSearch.toLowerCase();
    return (
      e.numero.toLowerCase().includes(term) ||
      e.vereador.toLowerCase().includes(term) ||
      e.area.toLowerCase().includes(term) ||
      e.tipoDespesa.toLowerCase().includes(term) ||
      e.objeto.toLowerCase().includes(term) ||
      (e.entidadeBeneficiada && e.entidadeBeneficiada.toLowerCase().includes(term)) ||
      (e.razoesImpedimento && e.razoesImpedimento.toLowerCase().includes(term)) ||
      (e.remanejamentoObjeto && e.remanejamentoObjeto.toLowerCase().includes(term))
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'numero') {
      const numA = parseInt(a.numero.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.numero.replace(/\D/g, '')) || 0;
      comparison = numA - numB;
    } else if (sortField === 'valor') {
      comparison = a.valorPrevisto - b.valorPrevisto;
    } else if (sortField === 'vereador') {
      comparison = a.vereador.localeCompare(b.vereador);
    } else if (sortField === 'area') {
      comparison = a.area.localeCompare(b.area);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleToggleSort = (field: 'numero' | 'valor' | 'vereador' | 'area') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = sorted.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5" id="lista">
      {/* Header of the List */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-blue-700" />
            Lista Completa de Emendas
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Demonstrativo detalhado de cada emenda parlamentar, dotação orçamentária e parecer técnico
          </p>
        </div>

        {/* Search inside list & View switch */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar nesta lista..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              title="Visualização em Tabela"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Visualização em Cards"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleToggleSort('numero')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>N.º</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('vereador')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Vereador(a)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('area')}
                  className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Área & Tipo</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 max-w-xs">Objeto da Emenda</th>
                <th
                  onClick={() => handleToggleSort('valor')}
                  className="py-3 px-3.5 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor Previsto</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 text-center">Situação / Parecer</th>
                <th className="py-3 px-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhuma emenda encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginated.map((emenda) => {
                  const hasRemanejamento = Boolean(
                    emenda.remanejamentoObjeto && emenda.remanejamentoObjeto.trim().length > 0
                  );

                  return (
                    <tr
                      key={emenda.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs">
                            #{emenda.numero}
                          </span>
                          {emenda.isNovaEmenda && (
                            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.2 rounded">
                              Nova
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <ParlamentarAvatar nome={emenda.vereador} size="sm" />
                          <span className="font-semibold text-slate-900">{emenda.vereador}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-medium text-slate-900 block truncate max-w-[170px]">
                          {emenda.area}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                          {emenda.tipoDespesa}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 max-w-sm">
                        <p className="line-clamp-2 text-xs leading-relaxed" title={emenda.objeto}>
                          {emenda.objeto}
                        </p>
                        {emenda.entidadeBeneficiada && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded mt-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {emenda.entidadeBeneficiada}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {emenda.valorPrevistoFormatado}
                        </div>
                        <div className="text-[10px] text-slate-400" title="Receita Corrente Líquida">
                          RCL: {emenda.receitaCorrenteLiquidaFormatada}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {emenda.temImpedimentoTecnico ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Impedimento Técnico
                            </span>
                            {hasRemanejamento && (
                              <span className="text-[10px] text-indigo-700 font-semibold mt-0.5">
                                Remanejada
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Sem Impedimento
                          </span>
                        )}
                        {emenda.emendaExecutada && emenda.emendaExecutada.trim() !== '' && emenda.emendaExecutada.trim() !== '-' && (
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                emenda.emendaExecutada.trim().toLowerCase() === 'sim'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : emenda.emendaExecutada.trim().toLowerCase() === 'não'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                              title="Situação de execução da emenda parlamentar (Coluna AF)"
                            >
                              Executada: {emenda.emendaExecutada.trim()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onOpenDetalhes(emenda)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((emenda) => (
            <div
              key={emenda.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs font-mono">
                    Emenda #{emenda.numero}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {emenda.valorPrevistoFormatado}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <ParlamentarAvatar nome={emenda.vereador} size="sm" />
                  <h4 className="font-bold text-slate-900 text-sm truncate">{emenda.vereador}</h4>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">{emenda.area}</span>
                  <span>•</span>
                  <span>{emenda.tipoDespesa}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mb-2 leading-relaxed">
                  {emenda.objeto}
                </p>

                {emenda.entidadeBeneficiada && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-medium">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      {emenda.entidadeBeneficiada}
                    </span>
                  </div>
                )}

                {emenda.temImpedimentoTecnico ? (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 mb-3 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Impedimento Técnico</strong>
                      <p className="line-clamp-2 text-[10px] text-amber-800">
                        {emenda.razoesImpedimento || 'Ver justificativa detalhada'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 mb-3 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Regular / Aprovada para execução</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">RCL: {emenda.receitaCorrenteLiquidaFormatada}</span>
                <button
                  type="button"
                  onClick={() => onOpenDetalhes(emenda)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha Completa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Itens por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-700"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>
            Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sorted.length)} de {sorted.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-semibold text-slate-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
