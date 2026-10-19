import React from 'react';
import { MapPin, Clock, Phone, Mail, Shield, ExternalLink, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 no-print">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Institutional */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center p-2 font-bold shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 8 L85 22 V55 C85 75 50 92 50 92 C50 92 15 75 15 55 V22 Z" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="4" />
                  <circle cx="50" cy="45" r="14" fill="#ffffff" />
                </svg>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-bold block">
                  Poder Legislativo
                </span>
                <h4 className="text-base font-extrabold text-white">Câmara Municipal de Ubá</h4>
                <p className="text-xs text-slate-400">Minas Gerais</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal da Transparência para acompanhamento, fiscalização e controle social das Emendas Parlamentares Impositivas do município de Ubá - MG.
            </p>
          </div>

          {/* Col 2: Endereço & Horário */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Atendimento ao Cidadão
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Praça São Januário, nº 238 - Centro<br />CEP 36500-000 - Ubá - MG</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Segunda a Sexta-feira<br />Das 08h às 18h</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contatos */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Canais Oficiais
            </h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>(32) 3539-5000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contato@camarauba.mg.gov.br</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lei Geral de Proteção de Dados (LGPD)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Links Rápidos */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Transparência
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="#emendas"
                  className="hover:text-blue-400 transition-colors flex items-center justify-between"
                >
                  <span>Relatório de Emendas 2026</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="#autores"
                  className="hover:text-blue-400 transition-colors flex items-center justify-between"
                >
                  <span>Vereadores Proponentes</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="#destinos"
                  className="hover:text-blue-400 transition-colors flex items-center justify-between"
                >
                  <span>Destino das Emendas</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" /> Voltar ao Topo
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-400 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Câmara Municipal de Ubá - Minas Gerais. Todos os direitos reservados.
          </span>
          <span className="text-[11px] text-slate-400">
            Transparência Pública e Acesso à Informação (Lei nº 12.527/2011)
          </span>
        </div>
      </div>
    </footer>
  );
};
