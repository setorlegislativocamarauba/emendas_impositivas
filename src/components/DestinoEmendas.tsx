import React from 'react';
import { Building2, Heart, Wrench, ShieldAlert, Users, ArrowRight } from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';

interface DestinoEmendasProps {
  emendas: Emenda[];
  onSelectBeneficiario: (nome: string) => void;
}

export const DestinoEmendas: React.FC<DestinoEmendasProps> = ({ emendas, onSelectBeneficiario }) => {
  // Aggregate by destination entity/neighborhood
  const map = new Map<string, { total: number; count: number; autores: Set<string>; areas: Set<string> }>();

  emendas.forEach((e) => {
    const nome = e.entidadeBeneficiada || 'Outras Ações';
    const cur = map.get(nome) || {
      total: 0,
      count: 0,
      autores: new Set<string>(),
      areas: new Set<string>(),
    };

    cur.total += e.valorPrevisto;
    cur.count += 1;
    if (e.vereador) cur.autores.add(e.vereador);
    if (e.area) cur.areas.add(e.area);

    map.set(nome, cur);
  });

  const destinos = Array.from(map.entries())
    .map(([nome, data]) => ({
      nome,
      total: data.total,
      count: data.count,
      autores: Array.from(data.autores),
      areas: Array.from(data.areas),
    }))
    .sort((a, b) => b.total - a.total);

  const getEntityIcon = (nome: string) => {
    const lower = nome.toLowerCase();
    if (lower.includes('hospital') || lower.includes('câncer') || lower.includes('saúde')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    }
    if (lower.includes('obras') || lower.includes('pavimentação') || lower.includes('asfalto')) {
      return <Wrench className="w-5 h-5 text-amber-500" />;
    }
    return <Building2 className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4" id="destinos">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            Destino das Emendas Impositivas
          </h3>
          <p className="text-slate-500 text-xs">
            Acompanhe para onde foram destinados os recursos das emendas dos parlamentares em Ubá
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          {destinos.length} destinos identificados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinos.slice(0, 9).map((destino) => (
          <div
            key={destino.nome}
            onClick={() => onSelectBeneficiario(destino.nome)}
            className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-100">
                  {getEntityIcon(destino.nome)}
                </div>
                <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {formatCurrency(destino.total)}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors line-clamp-2">
                {destino.nome}
              </h4>

              <div className="flex flex-wrap gap-1 mt-2">
                {destino.areas.slice(0, 2).map((a) => (
                  <span
                    key={a}
                    className="text-[10px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {destino.autores.length} vereador(es) • {destino.count} emendas
              </span>
              <span className="text-blue-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
