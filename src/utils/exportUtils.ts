import { Emenda } from '../types/emenda';
import { formatCurrency } from './csvParser';

/**
 * Exporta a planilha completa em formato CSV compatível com Excel e Google Sheets (ponto e vírgula e UTF-8 BOM).
 * Contém TODAS as colunas originais da planilha oficial (tanto da destinação original quanto do remanejamento).
 */
export function exportToCSV(emendas: Emenda[], filename = 'emendas-impositivas-uba-2026.csv') {
  const headers = [
    'N.º Emenda',
    'Vereador(a) Autor(a)',
    'Palavra-Chave / Ref',
    'Área Temática',
    'Tipo de Despesa',
    'Objeto da Emenda (Descrição Completa)',
    'Entidade / Local Beneficiado',
    'Programa Orçamentário',
    'Ação Orçamentária',
    'Ficha de Anulação',
    'Nova Ficha',
    'Valor Previsto (R$)',
    'Receita Corrente Líquida - RCL (R$)',
    'Impedimento Técnico?',
    'Razões Técnicas para o Impedimento',
    'Remanejamento: Vereador',
    'Remanejamento: N.º Emenda',
    'Remanejamento: Área',
    'Remanejamento: Tipo de Despesa',
    'Remanejamento: Objeto / Destino',
    'Remanejamento: Programa',
    'Remanejamento: Ação',
    'Remanejamento: Valor (R$)',
    'Saneamento do Remanejamento',
    'Emenda Executada',
  ];

  const escapeCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = emendas.map((e) => [
    escapeCell(e.numero),
    escapeCell(e.vereador),
    escapeCell(e.palavraChave && e.palavraChave !== '0' ? e.palavraChave : ''),
    escapeCell(e.area),
    escapeCell(e.tipoDespesa),
    escapeCell(e.objeto),
    escapeCell(e.entidadeBeneficiada || 'Administração Direta'),
    escapeCell(e.programa || ''),
    escapeCell(e.acao || ''),
    escapeCell(e.fichaAnulacao || ''),
    escapeCell(e.novaFicha || ''),
    escapeCell(e.valorPrevistoFormatado),
    escapeCell(e.receitaCorrenteLiquidaFormatada),
    escapeCell(e.temImpedimentoTecnico ? 'Sim' : 'Não'),
    escapeCell(e.razoesImpedimento || ''),
    escapeCell(e.remanejamentoVereador || e.vereador),
    escapeCell(e.remanejamentoNumero || e.numero),
    escapeCell(e.remanejamentoArea || ''),
    escapeCell(e.remanejamentoTipoDespesa || ''),
    escapeCell(e.remanejamentoObjeto || ''),
    escapeCell(e.remanejamentoPrograma || ''),
    escapeCell(e.remanejamentoAcao || ''),
    escapeCell(e.remanejamentoValorFormatado || ''),
    escapeCell(e.remanejamentoSaneamento || ''),
    escapeCell(e.emendaExecutada || '-'),
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta a planilha em formato Excel (.xls) com formatação rica, cabeçalho oficial e TODAS as colunas originais.
 */
export function exportToExcel(emendas: Emenda[], filename = 'emendas-impositivas-uba-2026.xls') {
  const totalPrevisto = emendas.reduce((acc, e) => acc + e.valorPrevisto, 0);
  const totalRCL = emendas.reduce((acc, e) => acc + e.receitaCorrenteLiquida, 0);

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Emendas Impositivas 2026</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        th { background-color: #0f3cbd; color: #ffffff; font-weight: bold; padding: 8px 10px; border: 1px solid #94a3b8; font-size: 11px; }
        th.rem { background-color: #0284c7; }
        td { padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 11px; vertical-align: top; }
        .currency { mso-number-format:"\\R\\$\\ #\\,##0\\.00"; text-align: right; font-family: Consolas, monospace; }
        .center { text-align: center; }
        .total-row { background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #0f172a; }
      </style>
    </head>
    <body>
      <h2>CÂMARA MUNICIPAL DE UBÁ - ESTADO DE MINAS GERAIS</h2>
      <h3>RELATÓRIO COMPLETO DE EMENDAS PARLAMENTARES IMPOSITIVAS - EXERCÍCIO FINANCEIRO DE 2026</h3>
      <p>Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • Total de Registros: ${emendas.length}</p>
      <br/>
      <table>
        <thead>
          <tr>
            <th>N.º</th>
            <th>Vereador(a)</th>
            <th>Palavra-Chave</th>
            <th>Área</th>
            <th>Tipo de Despesa</th>
            <th>Objeto da Emenda (Descrição Completa)</th>
            <th>Entidade / Beneficiário</th>
            <th>Programa</th>
            <th>Ação</th>
            <th>Ficha Anulação</th>
            <th>Nova Ficha</th>
            <th>Valor Previsto</th>
            <th>Receita Corrente Líquida (RCL)</th>
            <th>Impedimento Técnico</th>
            <th>Razões do Impedimento</th>
            <th class="rem">Remanejamento: Autor</th>
            <th class="rem">Remanejamento: N.º</th>
            <th class="rem">Remanejamento: Área</th>
            <th class="rem">Remanejamento: Tipo Despesa</th>
            <th class="rem">Remanejamento: Novo Objeto</th>
            <th class="rem">Remanejamento: Programa</th>
            <th class="rem">Remanejamento: Ação</th>
            <th class="rem">Remanejamento: Valor</th>
            <th class="rem">Saneamento do Remanejamento</th>
            <th>Emenda Executada</th>
          </tr>
        </thead>
        <tbody>
  `;

  emendas.forEach((e) => {
    html += `
      <tr>
        <td class="center font-bold">${e.numero}</td>
        <td><b>${e.vereador}</b></td>
        <td>${e.palavraChave && e.palavraChave !== '0' ? e.palavraChave : '-'}</td>
        <td>${e.area}</td>
        <td>${e.tipoDespesa}</td>
        <td>${e.objeto}</td>
        <td><b>${e.entidadeBeneficiada || 'Administração Direta'}</b></td>
        <td class="center">${e.programa || '-'}</td>
        <td class="center">${e.acao || '-'}</td>
        <td class="center">${e.fichaAnulacao || '-'}</td>
        <td class="center">${e.novaFicha || '-'}</td>
        <td class="currency">${e.valorPrevistoFormatado}</td>
        <td class="currency">${e.receitaCorrenteLiquidaFormatada}</td>
        <td class="center">${e.temImpedimentoTecnico ? 'SIM' : 'NÃO'}</td>
        <td>${e.razoesImpedimento || '-'}</td>
        <td>${e.remanejamentoVereador || e.vereador}</td>
        <td class="center">${e.remanejamentoNumero || e.numero}</td>
        <td>${e.remanejamentoArea || '-'}</td>
        <td>${e.remanejamentoTipoDespesa || '-'}</td>
        <td>${e.remanejamentoObjeto || '-'}</td>
        <td class="center">${e.remanejamentoPrograma || '-'}</td>
        <td class="center">${e.remanejamentoAcao || '-'}</td>
        <td class="currency">${e.remanejamentoValorFormatado || '-'}</td>
        <td>${e.remanejamentoSaneamento || '-'}</td>
        <td class="center"><b>${e.emendaExecutada || '-'}</b></td>
      </tr>
    `;
  });

  html += `
        <tr class="total-row">
          <td colspan="11">TOTAL GERAL CONSOLIDADO (${emendas.length} emendas)</td>
          <td class="currency">${formatCurrency(totalPrevisto)}</td>
          <td class="currency">${formatCurrency(totalRCL)}</td>
          <td colspan="12"></td>
        </tr>
      </tbody>
    </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrintReport() {
  window.print();
}
