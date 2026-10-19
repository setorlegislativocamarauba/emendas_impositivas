import React from 'react';
import { Users, ArrowUpRight, ExternalLink, FileText } from 'lucide-react';
import { Emenda } from '../types/emenda';
import { formatCurrency } from '../utils/csvParser';
import { ParlamentarAvatar } from './ParlamentarAvatar';
import { findParlamentar } from '../utils/parlamentarService';

interface AutoresInvestimentosProps {
  emendas: Emenda[];
  onOpenVereadorModal: (autor: string) => void;
  onSelectAutor?: (autor: string) => void;
  autorSelecionado?: string;
}

export const AutoresInvestimentos: React.FC<AutoresInvestimentosProps> = ({
  emendas,
  onOpenVereadorModal,
  onSelectAutor,
  autorSelecionado,
}) => {
  // Aggregate data per council member based on Column M (Valor Previsto)
  const autoresMap = new Map<
    string,
    {
      total: number;
      totalSaude: number;
      countOrig: number;
      countRem: number;
      emendas: Emenda[];
    }
  >();

  emendas.forEach((e) => {
    if (!e.vereador) return;
    const cur = autoresMap.get(e.vereador) || {
      total: 0,
      totalSaude: 0,
      countOrig: 0,
      countRem: 0,
      emendas: [],
    };

    if (!e.isNovaEmenda) {
      cur.total += e.valorPrevisto;
      if (e.area.toLowerCase().includes('saúde') || e.area.toLowerCase().includes('saude')) {
        cur.totalSaude += e.valorPrevisto;
      }
      cur.countOrig += 1;
    } else {
      cur.countRem += 1;
      if (e.area.toLowerCase().includes('saúde') || e.area.toLowerCase().includes('saude')) {
        cur.totalSaude += e.valorPrevisto;
      }
    }
    cur.emendas.push(e);

    autoresMap.set(e.vereador, cur);
  });

  // Preserve the exact sequence of council members from the spreadsheet
  const autores = Array.from(autoresMap.entries())
    .map(([nome, data]) => ({
      nome,
      total: data.total,
      totalSaude: data.totalSaude,
      countOrig: data.countOrig,
      countRem: data.countRem,
      percentualSaude: data.total > 0 ? (data.totalSaude / data.total) * 100 : 0,
    }));

  const getInitials = (nome: string) => {
    const parts = nome.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4" id="autores">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            Autores de Investimentos
          </h3>
          <p className="text-slate-500 text-xs">
            Cota igualitária de R$ 618.186,00 por vereador. Clique no vereador para ver todas as suas emendas, imprimir ou salvar em PDF.
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          {autores.length} parlamentares
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {autores.map((parlamentar) => {
          const isSelected = autorSelecionado === parlamentar.nome;
          const metaSaude = parlamentar.percentualSaude >= 50;

          return (
            <div
              key={parlamentar.nome}
              onClick={() => onOpenVereadorModal(parlamentar.nome)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <ParlamentarAvatar nome={parlamentar.nome} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-700 transition-colors">
                        {parlamentar.nome}
                      </h4>
                      {(() => {
                        const info = findParlamentar(parlamentar.nome);
                        if (!info?.saplUrl) return null;
                        return (
                          <a
                            href={info.saplUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Ver perfil oficial no SAPL (Câmara de Ubá)"
                            className="text-slate-400 hover:text-blue-700 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        );
                      })()}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      Vereador(a) Municipal
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 py-2 border-y border-slate-200/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Cota Prevista:</span>
                    <strong className="text-slate-900 font-bold">{formatCurrency(parlamentar.total)}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">N.º de Emendas:</span>
                    <span className="font-semibold text-slate-700">
                      {parlamentar.countOrig} {parlamentar.countRem > 0 && `(+${parlamentar.countRem} rem.)`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Saúde (50%):</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(parlamentar.totalSaude)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-900">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Ver emendas (PDF / Imprimir)
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
