import React, { useState } from 'react';
import { X, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon, HelpCircle, Code } from 'lucide-react';

interface SheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
  onResetToDefault: () => void;
  isLoading: boolean;
  error: string | null;
  totalLoaded: number;
  totalVereadores: number;
}

export const SheetConfigModal: React.FC<SheetConfigModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onResetToDefault,
  isLoading,
  error,
  totalLoaded,
  totalVereadores,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      onResetToDefault();
      return;
    }
    onSaveUrl(inputUrl.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Vincular Planilha do Google Sheets</h3>
              <p className="text-xs text-blue-100">Atualização em tempo real das emendas e vereadores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <p className="font-semibold text-slate-800">
                  {currentUrl ? 'Planilha Online Conectada' : 'Base Oficial Padrão (Embutida)'}
                </p>
                <p className="text-slate-500 text-xs">
                  {totalLoaded} emendas • {totalVereadores} vereadores identificados
                </p>
              </div>
            </div>
            {currentUrl && (
              <button
                onClick={onResetToDefault}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Restaurar Base Padrão
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Não foi possível carregar a planilha</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cole o Link da sua Planilha do Google Sheets
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=0"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Cole o link de visualização ou compartilhamento da sua planilha Google.
              </p>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
              <Code className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 block mb-0.5">Como deixar o link fixo no código?</strong>
                <p className="text-slate-600">
                  Você pode colar o link aqui para carregar agora, ou me enviar o link no chat para deixá-lo fixo no arquivo <code>src/config/sheetConfig.ts</code>. Assim ninguém precisará colar links na tela.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Carregando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Carregar Planilha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
