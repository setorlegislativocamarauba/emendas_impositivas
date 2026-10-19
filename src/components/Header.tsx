import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Share2,
  Search,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { EXERCICIO_ATUAL, PORTAL_TITULO, PORTAL_SUBTITULO } from '../config/sheetConfig';
import { useCamaraLogo } from '../utils/logoManager';

interface HeaderProps {
  onRefreshData: () => void;
  isLoading: boolean;
  onQuickSearch: (query: string) => void;
  onOpenConfigModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshData,
  isLoading,
  onQuickSearch,
  onOpenConfigModal,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [quickSearchInput, setQuickSearchInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logo, isCustom, uploadLogo, resetLogo } = useCamaraLogo();

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAdjustFontSize = (direction: 'plus' | 'minus' | 'reset') => {
    let newLevel = fontSizeLevel;
    if (direction === 'plus' && fontSizeLevel < 3) newLevel = fontSizeLevel + 1;
    if (direction === 'minus' && fontSizeLevel > -2) newLevel = fontSizeLevel - 1;
    if (direction === 'reset') newLevel = 0;
    setFontSizeLevel(newLevel);

    const baseSizes = [85, 92, 100, 110, 120, 130];
    const index = newLevel + 2;
    document.documentElement.style.fontSize = `${baseSizes[index]}%`;
  };

  const handleToggleContrast = () => {
    const nextState = !isHighContrast;
    setIsHighContrast(nextState);
    if (nextState) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleToggleVoiceReading = () => {
    if (!('speechSynthesis' in window)) {
      showNotification('Seu navegador não possui suporte à síntese de voz.');
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const textToRead = `Câmara Municipal de Ubá. Portal de Transparência de Emendas Parlamentares Impositivas do Exercício ${EXERCICIO_ATUAL}. Acompanhe a destinação e fiscalização dos recursos públicos indicados pelos vereadores.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => {
    const title = `Emendas Parlamentares Impositivas ${EXERCICIO_ATUAL} - Câmara Municipal de Ubá`;
    const url = window.location.href;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showNotification('Link copiado com sucesso para a área de transferência!');
    }
    setShowShareMenu(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(quickSearchInput);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Accessibility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            <span className="text-slate-400 font-medium">Acessibilidade:</span>
            <button
              onClick={() => handleAdjustFontSize('plus')}
              title="Aumentar tamanho da fonte"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              A+
            </button>
            <button
              onClick={() => handleAdjustFontSize('minus')}
              title="Diminuir tamanho da fonte"
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              A-
            </button>
            <button
              onClick={() => handleAdjustFontSize('reset')}
              title="Redefinir tamanho"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToggleContrast}
              title="Alto Contraste"
              className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                isHighContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Contraste</span>
            </button>
            <button
              onClick={handleToggleVoiceReading}
              title={isReading ? 'Parar leitura de voz' : 'Leitura de voz da página'}
              className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                isReading ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isReading ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              <span>{isReading ? 'Parar Áudio' : 'Ouvir'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Base Oficial Fixa Pill (clicável para alterar o link se desejar) */}
            <button
              onClick={onOpenConfigModal}
              title="Clique para vincular ou testar outro link de planilha"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base Oficial {EXERCICIO_ATUAL}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Link direto ao SAPL */}
            <a
              href="https://sapl.uba.mg.leg.br/parlamentar/"
              target="_blank"
              rel="noopener noreferrer"
              title="Acessar lista de parlamentares no SAPL da Câmara Municipal de Ubá"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <span>SAPL Ubá</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Quick Refresh */}
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              title="Recarregar dados"
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Identification Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Official Emblem & Title */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative group shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Clique para carregar sua versão personalizada do Brasão / Logo (.png, .jpg)"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 text-white flex items-center justify-center p-1.5 shadow-md border-2 border-blue-500/20 cursor-pointer relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={logo}
                  alt="Brasão Oficial da Câmara Municipal de Ubá"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
                <div className="absolute inset-0 bg-blue-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white text-center p-1">
                  <Upload className="w-4 h-4 mb-0.5 text-blue-200" />
                  <span>Trocar PNG</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await uploadLogo(file);
                  }
                  e.target.value = '';
                }}
              />

              {isCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetLogo();
                  }}
                  title="Restaurar brasão oficial padrão"
                  className="absolute -top-1.5 -right-1.5 bg-amber-500 hover:bg-amber-600 text-white p-1 rounded-full shadow-md text-[10px] flex items-center justify-center z-10 transition-transform hover:scale-110"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-1 flex items-center justify-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
                title="Carregar nova imagem PNG para o Brasão da Câmara"
              >
                <Upload className="w-2.5 h-2.5" />
                <span>{isCustom ? 'Trocar PNG' : 'Trocar logo'}</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  Transparência Legislativa
                </span>
                <span className="text-xs text-slate-500 font-medium">Exercício {EXERCICIO_ATUAL}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {PORTAL_TITULO}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {PORTAL_SUBTITULO}
              </p>
            </div>
          </div>

          {/* Quick Search & Portals Links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar emendas..."
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="w-full pl-9 pr-16 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Buscar
              </button>
            </form>

            {/* Quick Actions & Share */}
            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Compartilhar</span>
              </button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-medium text-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-medium text-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-medium text-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span> Twitter / X
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-medium text-blue-700"
                  >
                    Copiar Link da Página
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <ul className="flex items-center gap-1 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold tracking-wide py-2.5">
            <li>
              <a href="#emendas" className="text-slate-300 hover:text-white px-2 py-1 rounded transition-colors">
                Início
              </a>
            </li>
            <li>
              <a href="#graficos" className="text-slate-300 hover:text-white px-2 py-1 rounded transition-colors">
                Indicadores & Gráficos
              </a>
            </li>
            <li>
              <a href="#destinos" className="text-slate-300 hover:text-white px-2 py-1 rounded transition-colors">
                Destino dos Recursos
              </a>
            </li>
            <li>
              <a href="#autores" className="text-slate-300 hover:text-white px-2 py-1 rounded transition-colors">
                Vereadores Autores
              </a>
            </li>
            <li className="relative">
              <a
                href="#lista"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <span>Emendas Impositivas {EXERCICIO_ATUAL}</span>
                <span className="bg-blue-800 text-blue-200 text-[10px] px-1.5 py-0.2 rounded font-bold">Oficial</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
};
