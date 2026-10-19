/**
 * Configuração fixa do Portal de Emendas Impositivas - Ubá / MG
 *
 * O link da planilha fica preso e fixo diretamente no código-fonte,
 * sem necessidade do usuário colar ou configurar links na interface.
 * Para mudar de ano (ex.: 2026 -> 2027), basta alterar estas constantes ou
 * clonar o repositório para o novo exercício.
 */

// Ano do exercício financeiro/legislativo
export const EXERCICIO_ATUAL = '2026';

// Link fixo do Google Sheets (caso deseje sincronizar com uma planilha online publicada)
// Exemplo: 'https://docs.google.com/spreadsheets/d/SEU_ID/export?format=csv'
// Se deixado vazio ou se a planilha falhar, o sistema utiliza automaticamente
// a base completa oficial embutida (DEFAULT_UBA_CSV).
export const FIXED_GOOGLE_SHEETS_URL: string = 'https://docs.google.com/spreadsheets/d/166dHcjAtxzQpKuqf855VOl1rY_b29u5WhJqQY97Nrw8/edit?gid=0#gid=0';

// Título e Subtítulo oficiais do portal
export const PORTAL_TITULO = 'Câmara Municipal de Ubá';
export const PORTAL_SUBTITULO = 'Estado de Minas Gerais • Sistema Oficial de Emendas Impositivas';
export const PORTAL_EXERCICIO_LABEL = `Exercício ${EXERCICIO_ATUAL}`;
