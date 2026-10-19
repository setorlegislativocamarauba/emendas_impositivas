import React from 'react';
import {
  Coins,
  FileSpreadsheet,
  Building2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';

interface CardsMetricasProps {
  emendas: Emenda[];
}

export const CardsMetricas: React.FC<CardsMetricasProps> = ({ emendas }) => {
  // If viewing all amendments, sum original amendments (Column M) to avoid double counting remanejamentos.
  // If user filtered down to only new/reallocated amendments, count those.
  const isOnlyNovas = emendas.length > 0 && emendas.every((e) => e.isNovaEmenda);
  const baseEmendas = isOnlyNovas ? emendas : emendas.filter((e) => !e.isNovaEmenda);

  const totalPrevisto = baseEmendas.reduce((acc, e) => acc + e.valorPrevisto, 0);
  const totalRCL = baseEmendas.reduce((acc, e) => acc + e.receitaCorrenteLiquida, 0);

  // Distinct Beneficiaries
  const distinctEntidades = new Set(emendas.map((e) => e.entidadeBeneficiada).filter(Boolean));

  // Impediments & Remanejamentos
  const comImpedimento = emendas.filter((e) => e.temImpedimentoTecnico).length;
  const comRemanejamento = emendas.filter((e) => e.remanejamentoObjeto && e.remanejamentoObjeto.trim().length > 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Valor Total Investido */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Coins className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Valor Total Previsto
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 block truncate mt-0.5">
            {formatCurrency(totalPrevisto)}
          </span>
          <span className="text-xs text-slate-400 block truncate mt-0.5" title="Receita Corrente Líquida Ajustada">
            RCL: {formatCurrency(totalRCL)}
          </span>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
      </div>

      {/* 2. Total de Emendas */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-all group">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Total de Emendas
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 block truncate mt-0.5">
            {emendas.length}
          </span>
          <span className="text-xs text-slate-400 block truncate mt-0.5">
            {emendas.filter((e) => !e.isNovaEmenda).length} originais ({emendas.filter((e) => e.isNovaEmenda).length} remanejadas)
          </span>
        </div>
      </div>

      {/* 3. Beneficiários Atendidos */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-all group">
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Beneficiários Atendidos
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 block truncate mt-0.5">
            {distinctEntidades.size}
          </span>
          <span className="text-xs text-slate-400 block truncate mt-0.5">
            Hospitais, entidades e bairros
          </span>
        </div>
      </div>

      {/* 4. Impedimentos Técnicos */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4 hover:shadow-md transition-all group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
          comImpedimento > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {comImpedimento > 0 ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <CheckCircle className="w-6 h-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
            Impedimentos Técnicos
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 block truncate mt-0.5">
            {comImpedimento}
          </span>
          <span className="text-xs text-slate-400 block truncate mt-0.5">
            {comRemanejamento} saneadas / remanejadas
          </span>
        </div>
      </div>
    </div>
  );
};
