import { Emenda } from '../types/emenda';



/**
 * Parses numeric currency values from Brazilian real strings like "R$ 150.093,00" or "R$ 7.899,60"
 */
export function parseCurrency(val: string | undefined | null): number {
  if (!val) return 0;
  let clean = String(val).replace(/R\$/gi, '').trim();
  if (clean.includes('+')) {
    const parts = clean.split('+');
    return parts.reduce((acc, p) => acc + parseCurrency(p), 0);
  }
  // Remove thousand dots, convert decimal comma to dot
  clean = clean.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats a number into Brazilian currency string "R$ 1.234,56"
 */
export function formatCurrency(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return 'R$ 0,00';
  return val.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Robust CSV Line Parser that respects quotes, inner quotes, and commas
 */
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Determines a likely beneficiary entity/community from the objeto and area
 */
export function extractBeneficiary(objeto: string, area: string, remanejamentoObjeto?: string): string {
  const text = `${objeto} ${remanejamentoObjeto || ''}`.toLowerCase();

  if (text.includes('hospital santa isabel') || text.includes('santa isabel')) return 'Hospital Santa Isabel';
  if (text.includes('são vicente') || text.includes('sao vicente')) return 'Hospital São Vicente de Paulo';
  if (text.includes('combate ao câncer') || text.includes('núcleo regional')) return 'Núcleo Regional de Combate ao Câncer';
  if (text.includes('grapac')) return 'GRAPAC (Apoio Câncer)';
  if (text.includes('apae')) return 'APAE de Ubá';
  if (text.includes('supash')) return 'SUPASH (Proteção aos Animais)';
  if (text.includes('anália franco') || text.includes('analia franco')) return 'Sociedade Beneficente Anália Franco';
  if (text.includes('patronato')) return 'Patronato (Artes e Ofício)';
  if (text.includes('asilo')) return 'Asilo São Vicente de Paula';
  if (text.includes('lar joão de freitas') || text.includes('joao de freitas')) return 'Lar João de Freitas';
  if (text.includes('paraplégicos') || text.includes('paraplegicos')) return 'Associação Ubaense de Paraplégicos';
  if (text.includes('fraternidade ubaense')) return 'Loja Maçônica Fraternidade Ubaense';
  if (text.includes('artes marciais')) return 'Associação de Artes Marciais Zona da Mata';
  if (text.includes('solano trindade')) return 'Assoc. Solano Trindade (Anti-Discriminação)';
  if (text.includes('bonsucesso')) return 'Bonsucesso Futebol Clube';
  if (text.includes('diamantense')) return 'Diamantense Futebol Clube';
  if (text.includes('são domingos') || text.includes('unidos do são domingos')) return 'G.R. Unidos do São Domingos';
  if (text.includes('sabiá') || text.includes('capoeira')) return 'Assoc. de Capoeira Sabiá';
  if (text.includes('maria do carmo')) return 'Associação Maria do Carmo';
  if (text.includes('andorinhas')) return 'Associação Andorinhas';
  if (text.includes('bombeiros') || text.includes('adubar')) return 'Corpo de Bombeiros / ADUBAR';
  if (text.includes('ubá pequeno')) return 'Comunidade Ubá Pequeno';
  if (text.includes('emboque')) return 'Comunidade do Emboque';
  if (text.includes('diamante')) return 'Distrito de Diamante';
  if (text.includes('padre damião') || text.includes('colônia')) return 'Colônia Padre Damião';
  if (text.includes('barrinha')) return 'Comunidade da Barrinha';
  if (text.includes('altair rocha')) return 'Bairro Altair Rocha';
  if (text.includes('morro do querosene') || text.includes('querosene')) return 'Bairro Vila Casal / Querosene';
  if (text.includes('secretaria de saúde') || text.includes('posto de saúde') || text.includes('ubs') || area.toLowerCase().includes('saúde')) {
    return 'Secretaria Municipal de Saúde / UBS';
  }
  if (area.toLowerCase().includes('obras')) {
    return 'Secretaria Municipal de Obras / Infraestrutura';
  }
  if (area.toLowerCase().includes('agricultura') || area.toLowerCase().includes('mobilidade')) {
    return 'Secretaria de Agricultura e Meio Ambiente';
  }
  if (area.toLowerCase().includes('governo')) {
    return 'Secretaria de Governo / Projetos Sociais';
  }
  return 'Comunidade e Município de Ubá';
}

/**
 * Intelligent parser that identifies columns by their header names,
 * avoiding offsets where amendment numbers get confused with council member names.
 */
export function parseEmendasData(csvText: string): Emenda[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  // 1. Locate the header row
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 6); i++) {
    const rowStr = rows[i].join(' ').toLowerCase();
    if (
      rowStr.includes('vereador') ||
      rowStr.includes('objeto') ||
      (rowStr.includes('emenda') && rowStr.includes('valor'))
    ) {
      headerRowIndex = i;
      break;
    }
  }

  // Column index map
  let colIdxVereador = 1;
  let colIdxNumero = 2;
  let colIdxPalavraChave = 3;
  let colIdxArea = 4;
  let colIdxTipoDespesa = 5;
  let colIdxEntidade = -1; // Coluna G ("Nome completo da entidade", "Entidade", "Instituição")
  let colIdxObjeto = 6;
  let colIdxPrograma = 7;
  let colIdxAcao = 8;
  let colIdxFichaAnulacao = 9;
  let colIdxNovaFicha = 10;
  let colIdxValorPrevisto = 11;
  let colIdxRCL = 12;
  let colIdxImpedimento = 13;
  let colIdxRazoes = 14;

  let remIdxPalavra = 15;
  let remIdxVereador = 16;
  let remIdxNumero = 17;
  let remIdxArea = 18;
  let remIdxTipoDespesa = 19;
  let remIdxObjeto = 20;
  let remIdxPrograma = 21;
  let remIdxAcao = 22;
  let remIdxValor = 23;
  let remIdxSaneamento = 24;
  let colIdxEmendaExecutada = -1; // Coluna AF ("Emenda Executada" / "EXECUÇÃO DA EMENDA PARLAMENTAR")

  if (headerRowIndex !== -1) {
    const header = rows[headerRowIndex];
    header.forEach((rawCol, idx) => {
      const col = rawCol.toLowerCase().trim();

      // Emenda Executada (Coluna AF / Coluna 31 na planilha de 2026, ou Confirmação de Execução)
      if (
        col.includes('executada') ||
        col.includes('emenda executada') ||
        (col.includes('execu') && col.includes('emenda')) ||
        (col.includes('confirma') && col.includes('execu')) ||
        col === 'sim/não' ||
        col === 'sim/nao'
      ) {
        colIdxEmendaExecutada = idx;
      }
      // Entidade / Nome completo da entidade (Coluna G, mesmo se oculta no Google Sheets)
      else if (
        col.includes('entidade') ||
        col.includes('institui') ||
        col.includes('beneficiar') ||
        col.includes('nome completo')
      ) {
        colIdxEntidade = idx;
      }
      // Vereador (First occurrence is primary, second is remanejamento)
      else if (col.includes('vereador') || col.includes('parlamentar') || col.includes('autor')) {
        if (colIdxVereador === 1 && idx !== 1) {
          colIdxVereador = idx;
        } else if (idx > colIdxVereador && (remIdxVereador === 16 || remIdxVereador <= colIdxVereador)) {
          remIdxVereador = idx;
        }
      }
      // N.º Emenda (exclui Número do Empenho e Emenda Executada)
      else if (
        !col.includes('empenho') &&
        !col.includes('execut') &&
        (col.includes('n.º') ||
          (col.includes('numero') && !col.includes('empenho')) ||
          (col.includes('número') && !col.includes('empenho')) ||
          (col.includes('emenda') && !col.includes('objeto')))
      ) {
        if (colIdxNumero === 2 && idx !== 2) {
          colIdxNumero = idx;
        } else if (idx > colIdxNumero && (remIdxNumero === 17 || remIdxNumero <= colIdxNumero)) {
          remIdxNumero = idx;
        }
      }
      // Palavra-Chave
      else if (col.includes('palavra') || col.includes('chave') || col.includes('termo')) {
        if (colIdxPalavraChave === 3 && idx !== 3) colIdxPalavraChave = idx;
        else if (idx > colIdxPalavraChave) remIdxPalavra = idx;
      }
      // Área
      else if (col.includes('área') || col.includes('area')) {
        if (col.includes('remanejamento')) remIdxArea = idx;
        else colIdxArea = idx;
      }
      // Tipo de Despesa / Natureza da Despesa
      else if (col.includes('tipo') || col.includes('despesa') || col.includes('natureza')) {
        if (col.includes('remanejamento')) remIdxTipoDespesa = idx;
        else colIdxTipoDespesa = idx;
      }
      // Objeto da Emenda
      else if (col.includes('objeto') || col.includes('descrição') || col.includes('descricao')) {
        if (col.includes('remanejamento')) remIdxObjeto = idx;
        else colIdxObjeto = idx;
      }
      // Programa
      else if (col.includes('programa')) {
        if (colIdxPrograma === 7) colIdxPrograma = idx;
        else remIdxPrograma = idx;
      }
      // Ação
      else if (col.includes('ação') || col.includes('acao')) {
        if (colIdxAcao === 8) colIdxAcao = idx;
        else remIdxAcao = idx;
      }
      // Ficha de Anulação
      else if (col.includes('anula') || (col.includes('ficha') && !col.includes('nova'))) {
        colIdxFichaAnulacao = idx;
      }
      // Nova Ficha
      else if (col.includes('nova ficha')) {
        colIdxNovaFicha = idx;
      }
      // Valor Previsto (Coluna M no Google Sheets / Coluna 11 no CSV)
      else if (
        col.includes('valor previsto') ||
        (col.includes('previsto') && col.includes('valor')) ||
        (col === 'valor' && idx <= 13)
      ) {
        colIdxValorPrevisto = idx;
      }
      // Receita Corrente Líquida
      else if (col.includes('receita') || col.includes('corrente') || col.includes('rcl')) {
        colIdxRCL = idx;
      }
      // Valor do Remanejamento (Coluna X no Google Sheets)
      else if ((col === 'valor' || col.includes('valor')) && idx > 13) {
        remIdxValor = idx;
      }
      // Impedimento Técnico
      else if (col.includes('impedimento') && !col.includes('raz')) {
        colIdxImpedimento = idx;
      }
      // Razões Técnicas
      else if (col.includes('raz') || col.includes('justificativa')) {
        colIdxRazoes = idx;
      }
      // Saneamento
      else if (col.includes('saneamento')) {
        remIdxSaneamento = idx;
      }
      // Emenda Executada (Coluna AF / Coluna 31 ou Confirmação de Execução)
      else if (
        col.includes('executada') ||
        col.includes('emenda executada') ||
        (col.includes('execu') && col.includes('emenda')) ||
        (col.includes('confirma') && col.includes('execu')) ||
        col === 'sim/não' ||
        col === 'sim/nao'
      ) {
        colIdxEmendaExecutada = idx;
      }
    });
  }

  const emendas: Emenda[] = [];
  const startIndex = headerRowIndex !== -1 ? headerRowIndex + 1 : 2;

  let lastKnownVereador = '';

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    let colIdentificador = row[0] || '';
    let colVereador = (row[colIdxVereador] || '').trim();
    let colNumero = (row[colIdxNumero] || '').trim();
    const colPalavraChave = (row[colIdxPalavraChave] || '').trim();
    const colEntidade = colIdxEntidade !== -1 ? (row[colIdxEntidade] || '').trim() : '';
    const colArea = (row[colIdxArea] || '').trim();
    const colTipoDespesa = (row[colIdxTipoDespesa] || '').trim();
    const colObjeto = (row[colIdxObjeto] || '').trim();
    const colPrograma = (row[colIdxPrograma] || '').trim();
    const colAcao = (row[colIdxAcao] || '').trim();
    const colFichaAnulacao = (row[colIdxFichaAnulacao] || '').trim();
    const colNovaFicha = (row[colIdxNovaFicha] || '').trim();
    const colValorPrevisto = (row[colIdxValorPrevisto] || '').trim();
    const colRCL = (row[colIdxRCL] || '').trim();
    const colImpedimento = (row[colIdxImpedimento] || '').trim();
    const colRazoes = (row[colIdxRazoes] || '').trim();

    // Remanejamento columns
    const remPalavraChave = (row[remIdxPalavra] || '').trim();
    let remVereador = (row[remIdxVereador] || '').trim();
    const remNumero = (row[remIdxNumero] || '').trim();
    const remArea = (row[remIdxArea] || '').trim();
    const remTipoDespesa = (row[remIdxTipoDespesa] || '').trim();
    const remObjeto = (row[remIdxObjeto] || '').trim();
    const remPrograma = (row[remIdxPrograma] || '').trim();
    const remAcao = (row[remIdxAcao] || '').trim();
    const remValor = (row[remIdxValor] || '').trim();
    const remSaneamento = (row[remIdxSaneamento] || '').trim();

    // Emenda Executada (Coluna AF / índice 31 na planilha de 2026, ou índice detectado por cabeçalho)
    let colEmendaExecutada = '';
    const targetExecIdx = colIdxEmendaExecutada !== -1 ? colIdxEmendaExecutada : 31;
    if (row[targetExecIdx] !== undefined) {
      colEmendaExecutada = row[targetExecIdx].trim();
    } else if (
      row[25] !== undefined &&
      (row[25].trim().toLowerCase() === 'sim' ||
        row[25].trim().toLowerCase() === 'não' ||
        row[25].trim() === '-')
    ) {
      colEmendaExecutada = row[25].trim();
    }

    // If colVereador is purely numeric (e.g. "216", "102", "4"), it is an emenda number, NOT a person's name!
    if (/^\d+$/.test(colVereador)) {
      if (!colNumero || colNumero === '---' || colNumero === '') {
        colNumero = colVereador;
      }
      colVereador = '';
    }

    if (/^\d+$/.test(remVereador)) {
      remVereador = '';
    }

    let activeVereador = colVereador || remVereador;

    // If activeVereador is empty, check if row belongs to the previous council member
    if (!activeVereador && lastKnownVereador) {
      activeVereador = lastKnownVereador;
    } else if (activeVereador) {
      lastKnownVereador = activeVereador;
    }

    // Skip empty summary lines or rows without real data
    if (!activeVereador && !colNumero && !remNumero && !colObjeto && !remObjeto) {
      continue;
    }

    // Default if still missing
    if (!activeVereador) {
      activeVereador = 'Câmara Municipal de Ubá';
    }

    let activeNumero = colNumero || remNumero;
    if (!activeNumero || activeNumero === '---') {
      activeNumero = `${emendas.length + 1}`;
    }

    const isNovaEmenda =
      colIdentificador === '0' ||
      activeNumero.toLowerCase().includes('nova') ||
      (remObjeto.toLowerCase().includes('nova') && !colObjeto);

    const valorPrevisto = isNovaEmenda
      ? parseCurrency(remValor) || parseCurrency(colValorPrevisto)
      : parseCurrency(colValorPrevisto) || parseCurrency(remValor);

    const receitaCorrenteLiquida = isNovaEmenda
      ? valorPrevisto
      : parseCurrency(colRCL) || Math.round(valorPrevisto * 0.78996 * 100) / 100;

    const temImpedimento =
      colImpedimento.toLowerCase() === 'sim' ||
      Boolean(colRazoes && colRazoes.length > 5 && !colRazoes.toLowerCase().startsWith('não'));

    const remValorNum = parseCurrency(remValor);
    const activeArea = colArea || remArea || 'Outros';
    const activeTipoDespesa = colTipoDespesa || remTipoDespesa || 'Outros';
    const activeObjeto = colObjeto || remObjeto || 'Sem descrição cadastrada';

    // Determina a entidade: usa o valor da Coluna G ("Nome completo da entidade"), mesmo se oculta,
    // ou deduz por palavras-chave caso não tenha sido preenchida.
    const beneficiada = colEntidade || extractBeneficiary(activeObjeto, activeArea, remObjeto);

    // Palavras-chave: incorpora termos da coluna de palavras-chave e da Coluna G
    let activePalavraChave = colPalavraChave || remPalavraChave || '';
    if (activePalavraChave === '0') activePalavraChave = '';
    if (colEntidade) {
      if (activePalavraChave && !activePalavraChave.toLowerCase().includes(colEntidade.toLowerCase())) {
        activePalavraChave = `${activePalavraChave} | ${colEntidade}`;
      } else if (!activePalavraChave) {
        activePalavraChave = colEntidade;
      }
    }

    emendas.push({
      id: `emenda-${i}-${activeNumero}`,
      identificador: colIdentificador,
      vereador: activeVereador,
      numero: activeNumero,
      palavraChave: activePalavraChave,
      area: activeArea,
      tipoDespesa: activeTipoDespesa,
      objeto: activeObjeto,
      programa: (colPrograma && colPrograma !== '0' ? colPrograma : '') || (remPrograma && remPrograma !== '0' ? remPrograma : ''),
      acao: (colAcao && colAcao !== '0' ? colAcao : '') || (remAcao && remAcao !== '0' ? remAcao : ''),
      fichaAnulacao: colFichaAnulacao && colFichaAnulacao !== '0' ? colFichaAnulacao : '',
      novaFicha: colNovaFicha && colNovaFicha !== '0' ? colNovaFicha : '',
      valorPrevisto,
      valorPrevistoFormatado: formatCurrency(valorPrevisto),
      receitaCorrenteLiquida,
      receitaCorrenteLiquidaFormatada: formatCurrency(receitaCorrenteLiquida),
      temImpedimentoTecnico: temImpedimento,
      razoesImpedimento: colRazoes,
      remanejamentoPalavraChave: remPalavraChave,
      remanejamentoVereador: remVereador,
      remanejamentoNumero: remNumero,
      remanejamentoArea: remArea,
      remanejamentoTipoDespesa: remTipoDespesa,
      remanejamentoObjeto: remObjeto,
      remanejamentoPrograma: remPrograma,
      remanejamentoAcao: remAcao,
      remanejamentoValor: remValorNum,
      remanejamentoValorFormatado: remValor ? formatCurrency(remValorNum) : undefined,
      remanejamentoSaneamento: remSaneamento,
      confirmacaoExecucao: colEmendaExecutada,
      emendaExecutada: colEmendaExecutada,
      isNovaEmenda,
      entidadeBeneficiada: beneficiada,
    });
  }

  return emendas;
}

/**
 * Transforms any Google Sheet URL to its export CSV URL
 */
export function normalizeGoogleSheetUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  if (trimmed.endsWith('.csv') || trimmed.includes('output=csv') || trimmed.includes('format=csv')) {
    return trimmed;
  }

  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const docId = match[1];
    const gidMatch = trimmed.match(/gid=([0-9]+)/);
    const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv${gid}`;
  }

  const pubMatch = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) {
    return `https://docs.google.com/spreadsheets/d/e/${pubMatch[1]}/pub?output=csv`;
  }

  return trimmed;
}

/**
 * Fetches CSV content from Google Sheets, trying direct fetch first
 * and falling back to a CORS proxy if Google blocks direct browser access.
 */
export async function fetchSheetCsv(url: string): Promise<string> {
  const normalized = normalizeGoogleSheetUrl(url);

  // 1. Try direct fetch
  try {
    const res = await fetch(normalized);
    if (res.ok) {
      const text = await res.text();
      if (!text.includes('<!DOCTYPE html>') && text.length > 50) {
        return text;
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed, trying CORS fallback proxy...', directErr);
  }

  // 2. Try CORS proxy fallback 1 (allorigins)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalized)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      if (!text.includes('<!DOCTYPE html>') && text.length > 50) {
        return text;
      }
    }
  } catch (proxyErr) {
    console.warn('First proxy failed, trying secondary...', proxyErr);
  }

  // 3. Try secondary proxy fallback
  const secondaryProxy = `https://corsproxy.io/?${encodeURIComponent(normalized)}`;
  const resSecondary = await fetch(secondaryProxy);
  if (!resSecondary.ok) {
    throw new Error(`Não foi possível carregar a planilha (HTTP ${resSecondary.status}).`);
  }
  const finalText = await resSecondary.text();
  if (finalText.includes('<!DOCTYPE html>')) {
    throw new Error('A planilha retornou uma página de login. Por favor, publique-a na web (Arquivo > Compartilhar > Publicar na web).');
  }
  return finalText;
}
