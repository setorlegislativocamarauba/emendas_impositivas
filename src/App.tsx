import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FiltrosRelatorio } from './components/FiltrosRelatorio';
import { CardsMetricas } from './components/CardsMetricas';
import { GraficosEmendas } from './components/GraficosEmendas';
import { DestinoEmendas } from './components/DestinoEmendas';
import { AutoresInvestimentos } from './components/AutoresInvestimentos';
import { TabelaEmendas } from './components/TabelaEmendas';
import { ModalDetalhesEmenda } from './components/ModalDetalhesEmenda';
import { ModalVereadorEmendas } from './components/ModalVereadorEmendas';
import { SheetConfigModal } from './components/SheetConfigModal';
import { Footer } from './components/Footer';
import { DEFAULT_UBA_CSV } from './data/rawCsvData';
import { parseEmendasData, fetchSheetCsv } from './utils/csvParser';
import { exportToCSV, exportToExcel, triggerPrintReport } from './utils/exportUtils';
import { exportGeralPDF } from './utils/pdfExportService';
import { Emenda, FiltrosState } from './types/emenda';
import { EXERCICIO_ATUAL, FIXED_GOOGLE_SHEETS_URL, PORTAL_TITULO } from './config/sheetConfig';
import { ChevronRight, Home } from 'lucide-react';

const INITIAL_FILTROS: FiltrosState = {
  palavraChave: '',
  balanco: '',
  numero: '',
  exercicio: EXERCICIO_ATUAL,
  modalidade: '',
  autor: '',
  area: '',
  tipoDespesa: '',
  situacao: '',
};

export default function App() {
  const [emendas, setEmendas] = useState<Emenda[]>(() => parseEmendasData(DEFAULT_UBA_CSV));
  const [filtros, setFiltros] = useState<FiltrosState>(INITIAL_FILTROS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState<string>(() => localStorage.getItem('uba_emendas_google_sheet_url') || FIXED_GOOGLE_SHEETS_URL || '');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [emendaEmDetalhes, setEmendaEmDetalhes] = useState<Emenda | null>(null);
  const [vereadorModalNome, setVereadorModalNome] = useState<string | null>(null);

  // Initialize data: check fixed configuration or saved URL
  useEffect(() => {
    const urlToUse = FIXED_GOOGLE_SHEETS_URL || localStorage.getItem('uba_emendas_google_sheet_url') || '';
    if (urlToUse && urlToUse.trim().length > 0) {
      loadFromUrl(urlToUse.trim());
    } else {
      setEmendas(parseEmendasData(DEFAULT_UBA_CSV));
    }
  }, []);

  const loadFromUrl = async (url: string) => {
    setIsLoading(true);
    setSyncError(null);
    try {
      const text = await fetchSheetCsv(url);
      const parsed = parseEmendasData(text);
      if (parsed.length > 0) {
        setEmendas(parsed);
        setCustomUrl(url);
        localStorage.setItem('uba_emendas_google_sheet_url', url);
        setIsConfigModalOpen(false);
      } else {
        throw new Error('Nenhuma linha de emenda foi identificada nesta planilha.');
      }
    } catch (err: any) {
      console.warn('Falha ao sincronizar planilha online:', err);
      setSyncError(err.message || 'Erro ao sincronizar planilha.');
      setEmendas(parseEmendasData(DEFAULT_UBA_CSV));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    const urlToUse = FIXED_GOOGLE_SHEETS_URL || customUrl || '';
    if (urlToUse && urlToUse.trim().length > 0) {
      loadFromUrl(urlToUse.trim());
    } else {
      setEmendas(parseEmendasData(DEFAULT_UBA_CSV));
    }
  };

  // Distinct Filter options
  const autoresDisponiveis = useMemo(() => {
    return Array.from(new Set(emendas.map((e) => e.vereador).filter(Boolean))).sort();
  }, [emendas]);

  const areasDisponiveis = useMemo(() => {
    return Array.from(new Set(emendas.map((e) => e.area).filter(Boolean))).sort();
  }, [emendas]);

  const tiposDespesaDisponiveis = useMemo(() => {
    return Array.from(new Set(emendas.map((e) => e.tipoDespesa).filter(Boolean))).sort();
  }, [emendas]);

  // Filtered Emendas
  const emendasFiltradas = useMemo(() => {
    return emendas.filter((emenda) => {
      // Palavra-chave (Full text match)
      if (filtros.palavraChave.trim()) {
        const query = filtros.palavraChave.toLowerCase();
        const fullText = `${emenda.numero} ${emenda.vereador} ${emenda.area} ${emenda.tipoDespesa} ${emenda.objeto} ${emenda.palavraChave} ${emenda.entidadeBeneficiada || ''} ${emenda.razoesImpedimento || ''} ${emenda.remanejamentoObjeto || ''}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      // Número
      if (filtros.numero.trim()) {
        const cleanFiltroNum = filtros.numero.replace(/\D/g, '');
        const cleanEmendaNum = emenda.numero.replace(/\D/g, '');
        if (cleanFiltroNum && !cleanEmendaNum.includes(cleanFiltroNum)) {
          return false;
        }
      }

      // Autor / Vereador
      if (filtros.autor && emenda.vereador !== filtros.autor) {
        return false;
      }

      // Área
      if (filtros.area && emenda.area !== filtros.area) {
        return false;
      }

      // Tipo de Despesa
      if (filtros.tipoDespesa && emenda.tipoDespesa !== filtros.tipoDespesa) {
        return false;
      }

      // Situação
      if (filtros.situacao) {
        if (filtros.situacao === 'sem_impedimento' && emenda.temImpedimentoTecnico) {
          return false;
        }
        if (filtros.situacao === 'com_impedimento' && !emenda.temImpedimentoTecnico) {
          return false;
        }
        if (
          filtros.situacao === 'remanejada' &&
          (!emenda.remanejamentoObjeto || emenda.remanejamentoObjeto.trim().length === 0)
        ) {
          return false;
        }
        if (filtros.situacao === 'novas' && !emenda.isNovaEmenda) {
          return false;
        }
      }

      return true;
    });
  }, [emendas, filtros]);

  // Handlers
  const handleQuickSearch = (query: string) => {
    setFiltros((prev) => ({
      ...prev,
      palavraChave: query,
    }));
  };

  const handleSelectAutor = (autor: string) => {
    setFiltros((prev) => ({
      ...prev,
      autor: prev.autor === autor ? '' : autor,
    }));
  };

  const handleSelectArea = (area: string) => {
    setFiltros((prev) => ({
      ...prev,
      area: prev.area === area ? '' : area,
    }));
  };

  const handleSelectBeneficiario = (beneficiario: string) => {
    setFiltros((prev) => ({
      ...prev,
      palavraChave: beneficiario,
    }));
  };

  const handleImprimirGeralPDF = () => {
    exportGeralPDF(emendasFiltradas);
    try {
      triggerPrintReport();
    } catch {
      // PDF already downloaded
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Official Header */}
      <Header
        onRefreshData={handleRefreshData}
        isLoading={isLoading}
        onQuickSearch={handleQuickSearch}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Official Print Header (Only shown during window.print()) */}
      <div className="print-only p-6 border-b-2 border-slate-900 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase">{PORTAL_TITULO} - MINAS GERAIS</h1>
            <h2 className="text-sm font-semibold text-slate-700">
              Relatório de Emendas Parlamentares Impositivas - Exercício {EXERCICIO_ATUAL}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="font-bold">Total de Emendas:</span> {emendasFiltradas.length}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8" id="emendas">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 no-print">
          <a
            href="/"
            className="hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Início
          </a>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-800 font-bold">
            Emendas Impositivas | Exercício {EXERCICIO_ATUAL}
          </span>
        </div>

        {/* 1. Filter Section */}
        <FiltrosRelatorio
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onResetFiltros={() => setFiltros(INITIAL_FILTROS)}
          autoresDisponiveis={autoresDisponiveis}
          areasDisponiveis={areasDisponiveis}
          tiposDespesaDisponiveis={tiposDespesaDisponiveis}
          totalResultados={emendasFiltradas.length}
          totalGeral={emendas.length}
          onExportarCSV={() => exportToCSV(emendasFiltradas, `emendas-impositivas-uba-${EXERCICIO_ATUAL}.csv`)}
          onExportarExcel={() => exportToExcel(emendasFiltradas, `emendas-impositivas-uba-${EXERCICIO_ATUAL}.xls`)}
          onImprimirPDF={handleImprimirGeralPDF}
        />

        {/* 2. Key Indicator KPI Cards */}
        <CardsMetricas emendas={emendasFiltradas} />

        {/* 3. Interactive Data Visualizations & Charts */}
        <GraficosEmendas
          emendas={emendasFiltradas}
          onSelectAutor={handleSelectAutor}
          onSelectArea={handleSelectArea}
          onSelectEntidade={handleSelectBeneficiario}
        />

        {/* 4. Destinations and Beneficiaries Showcase */}
        <DestinoEmendas
          emendas={emendasFiltradas}
          onSelectBeneficiario={handleSelectBeneficiario}
        />

        {/* 5. Council Members Authors Grid */}
        <AutoresInvestimentos
          emendas={emendas}
          onOpenVereadorModal={(nome) => setVereadorModalNome(nome)}
          onSelectAutor={handleSelectAutor}
          autorSelecionado={filtros.autor}
        />

        {/* 6. Complete List & Table */}
        <TabelaEmendas
          emendas={emendasFiltradas}
          onOpenDetalhes={(emenda) => setEmendaEmDetalhes(emenda)}
        />
      </main>

      {/* Council Member Amendments Modal with Print / PDF */}
      <ModalVereadorEmendas
        vereadorNome={vereadorModalNome}
        emendas={emendas}
        onClose={() => setVereadorModalNome(null)}
        onOpenDetalhesEmenda={(emenda) => setEmendaEmDetalhes(emenda)}
      />

      {/* Amendment Details Modal */}
      <ModalDetalhesEmenda
        emenda={emendaEmDetalhes}
        onClose={() => setEmendaEmDetalhes(null)}
      />

      {/* Google Sheets Link Configuration Modal */}
      <SheetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentUrl={customUrl}
        onSaveUrl={(url) => loadFromUrl(url)}
        onResetToDefault={() => {
          localStorage.removeItem('uba_emendas_google_sheet_url');
          setCustomUrl('');
          setEmendas(parseEmendasData(DEFAULT_UBA_CSV));
          setIsConfigModalOpen(false);
        }}
        isLoading={isLoading}
        error={syncError}
        totalLoaded={emendas.length}
        totalVereadores={autoresDisponiveis.length}
      />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
