import React, { useState } from 'react';
import { PieChart, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';

interface GraficosEmendasProps {
  emendas: Emenda[];
  onSelectAutor?: (autor: string) => void;
  onSelectArea?: (area: string) => void;
  onSelectEntidade?: (entidade: string) => void;
}

export const GraficosEmendas: React.FC<GraficosEmendasProps> = ({
  emendas,
  onSelectArea,
  onSelectEntidade,
}) => {
  const [expandirEntidades, setExpandirEntidades] = useState(false);

  // Aggregate by Area / Category
  const areaMap = new Map<string, { total: number; count: number }>();
  // Aggregate by Beneficiary Entity
  const entidadeMap = new Map<string, { total: number; count: number }>();

  emendas.forEach((e) => {
    // Area
    if (e.area) {
      const cur = areaMap.get(e.area) || { total: 0, count: 0 };
      areaMap.set(e.area, { total: cur.total + e.valorPrevisto, count: cur.count + 1 });
    }

    // Beneficiary
    if (e.entidadeBeneficiada) {
      const cur = entidadeMap.get(e.entidadeBeneficiada) || { total: 0, count: 0 };
      entidadeMap.set(e.entidadeBeneficiada, { total: cur.total + e.valorPrevisto, count: cur.count + 1 });
    }
  });

  const areasSorted = Array.from(areaMap.entries())
    .map(([nome, data]) => ({ nome, ...data }))
    .sort((a, b) => b.total - a.total);

  const todasEntidades = Array.from(entidadeMap.entries())
    .map(([nome, data]) => ({ nome, ...data }))
    .sort((a, b) => b.total - a.total);

  const entidadesExibidas = expandirEntidades ? todasEntidades : todasEntidades.slice(0, 10);
  const maxEntidadeVal = todasEntidades[0]?.total || 1;
  const maxAreaVal = areasSorted[0]?.total || 1;

  const areaColors: Record<string, string> = {
    Saúde: 'bg-emerald-500',
    Obras: 'bg-blue-600',
    'Agricultura, Ambiente e Mobilidade Urbana': 'bg-amber-500',
    Governo: 'bg-purple-600',
    'Cultura, Turismo e Lazer': 'bg-pink-500',
    'Desenvolvimento Social': 'bg-teal-500',
  };

  return (
    <div className="space-y-6" id="graficos">
      {/* 1. Investimento por Entidade / Beneficiário (Largura Total) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Investimento por Entidade / Beneficiário
              </h3>
              <p className="text-slate-500 text-xs">Principais órgãos, entidades e ações contempladas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {expandirEntidades
                ? `Todos os direcionamentos (${todasEntidades.length})`
                : '10 maiores direcionamentos'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {entidadesExibidas.map((item, index) => {
            const pct = Math.round((item.total / maxEntidadeVal) * 100);
            return (
              <div
                key={item.nome}
                onClick={() => onSelectEntidade && onSelectEntidade(item.nome)}
                className="group cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                title={`Clique para filtrar por ${item.nome}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5.5 h-5.5 shrink-0 flex items-center justify-center rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                      {index + 1}º
                    </span>
                    <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {item.nome}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto pl-7 sm:pl-0">
                    <span className="text-[11px] text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded font-medium">
                      {item.count} {item.count === 1 ? 'emenda' : 'emendas'}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500 group-hover:brightness-110"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão Ver Mais / Ver Menos */}
        {todasEntidades.length > 10 && (
          <div className="pt-3.5 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Exibindo <strong>{entidadesExibidas.length}</strong> de <strong>{todasEntidades.length}</strong> entidades/beneficiários
            </span>

            <button
              type="button"
              onClick={() => setExpandirEntidades((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              {expandirEntidades ? (
                <>
                  <ChevronUp className="w-4 h-4 text-blue-700" />
                  Ver menos (recolher para os 10 maiores)
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-blue-700" />
                  Ver mais (+{todasEntidades.length - 10} entidades e direcionamentos)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 2. Distribuição por Categoria / Tema (Largura Total) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Emendas por Categoria / Tema
              </h3>
              <p className="text-slate-500 text-xs">Destinação orçamentária por área de atuação municipal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {areasSorted.map((area) => {
            const colorClass = areaColors[area.nome] || 'bg-slate-600';
            const pct = Math.round((area.total / maxAreaVal) * 100);
            return (
              <div
                key={area.nome}
                onClick={() => onSelectArea && onSelectArea(area.nome)}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[190px] group-hover:text-blue-600 transition-colors">
                    {area.nome}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {area.count}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 mb-2">
                  {formatCurrency(area.total)}
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} rounded-full`}
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
