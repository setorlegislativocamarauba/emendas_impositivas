import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Emenda } from '../types/emenda';
import { formatCurrency } from './csvParser';
import { getActiveLogo } from './logoManager';

export interface MetricasVereadorPDF {
  totalPrevisto: number;
  totalSaude: number;
  percentualSaude: number;
  totalEmendas: number;
  comImpedimento: number;
}

/**
 * Gera e faz o download direto do Relatório Oficial em PDF de um Vereador.
 * Funciona 100% de forma confiável no navegador e em iframes, salvando o arquivo .pdf no dispositivo.
 */
export function exportVereadorPDF(
  vereadorNome: string,
  emendas: Emenda[],
  metricas: MetricasVereadorPDF
): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = [15, 35, 80] as [number, number, number]; // #0f2350
    const goldColor = [180, 130, 20] as [number, number, number];

    // Cabeçalho Institucional
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 30, 'F');

    // Logo / Brasão Oficial da Câmara Municipal de Ubá no lado esquerdo do título
    try {
      const activeLogo = getActiveLogo();
      doc.addImage(activeLogo, 'PNG', 14, 4.5, 22, 20.5);
    } catch (e) {
      console.warn('Erro ao carregar brasão no PDF:', e);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.text('CÂMARA MUNICIPAL DE UBÁ - MINAS GERAIS', 39, 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('EMENDAS PARLAMENTARES IMPOSITIVAS', 39, 17.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Exercício Financeiro de 2026 • Lei Orçamentária Anual', 39, 23.5);

    const now = new Date();
    const dataEmissao = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`;
    doc.setFontSize(7.5);
    doc.text(`Emissão: ${dataEmissao}`, 196, 23.5, { align: 'right' });

    // Faixa dourada decorativa
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 30, 210, 1.5, 'F');

    // Título do Relatório
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`RELATÓRIO INDIVIDUAL: ${vereadorNome.toUpperCase()}`, 14, 40);

    // Box com Resumo de Métricas (Espaço otimizado para não vazar a palavra impedimento)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 44, 182, 20, 2, 2, 'FD');

    // Coluna 1: Total Destinado (x = 18 até 66)
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('TOTAL DESTINADO (COTA)', 18, 50);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrency(metricas.totalPrevisto), 18, 58);

    // Coluna 2: Destinação Saúde (x = 70 até 124)
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('DESTINAÇÃO SAÚDE (MÍN. 50%)', 70, 50);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 70);
    doc.text(`${formatCurrency(metricas.totalSaude)} (${metricas.percentualSaude.toFixed(1)}%)`, 70, 58);

    // Coluna 3: Quantidade de Emendas (x = 126 até 194 - 68mm de espaço)
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('TOTAL DE EMENDAS', 126, 50);

    const impInfo = metricas.comImpedimento > 0 ? ` (${metricas.comImpedimento} c/ impedimento)` : '';
    const fullTextEmendas = `${metricas.totalEmendas} emendas${impInfo}`;

    doc.setFont('helvetica', 'bold');
    let fontSizeEmendas = 10;
    doc.setFontSize(fontSizeEmendas);
    let textWidth = doc.getTextWidth(fullTextEmendas);

    // Proteção dinâmica caso a contagem seja extremamente longa
    if (126 + textWidth > 192) {
      fontSizeEmendas = 8.5;
      doc.setFontSize(fontSizeEmendas);
    }

    doc.setTextColor(15, 23, 42);
    doc.text(`${metricas.totalEmendas} emendas`, 126, 58);

    if (metricas.comImpedimento > 0) {
      const emendasWidth = doc.getTextWidth(`${metricas.totalEmendas} emendas `);
      doc.setTextColor(185, 28, 28); // Destaque em vermelho do impedimento
      doc.text(`(${metricas.comImpedimento} c/ impedimento)`, 126 + emendasWidth, 58);
    }

    // Tabela com todas as emendas (sem a coluna 2 duplicada, ampliando o espaço do objeto)
    const tableBody = emendas.map((e) => {
      const executada = (e.emendaExecutada && e.emendaExecutada.trim()) || '-';
      const objetoCompleto = e.objeto + (e.remanejamentoObjeto ? `\n[Remanejamento: ${e.remanejamentoObjeto}]` : '');

      return [
        e.numero,
        e.area,
        objetoCompleto,
        e.valorPrevistoFormatado,
        executada,
      ];
    });

    autoTable(doc, {
      startY: 68,
      head: [['N.º', 'Área', 'Objeto / Destinação', 'Valor (R$)', 'Emenda Executada']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 35, 80],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 32, fontStyle: 'bold' },
        2: { cellWidth: 84 },
        3: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const val = String(data.cell.raw).trim().toLowerCase();
          if (val === 'sim') {
            data.cell.styles.textColor = [22, 101, 52];
          } else if (val === 'não' || val === 'nao') {
            data.cell.styles.textColor = [190, 18, 60];
          }
        }
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
        valign: 'top',
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      foot: [
        [
          '',
          'TOTAL GERAL',
          `${emendas.length} emendas relacionadas`,
          formatCurrency(metricas.totalPrevisto),
          '',
        ],
      ],
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Rodapé da página
        const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
        const currentPage = data.pageNumber;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);

        doc.text(
          'Documento emitido pelo Portal de Transparência das Emendas Parlamentares • Câmara Municipal de Ubá/MG',
          14,
          290
        );
        doc.text(`Página ${currentPage} de ${pageCount}`, 196, 290, { align: 'right' });
      },
    });

    const safeName = vereadorNome.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const filename = `relatorio-emendas-2026-${safeName}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Erro ao gerar PDF do vereador:', err);
    return false;
  }
}

/**
 * Gera e faz o download direto do Relatório Oficial Geral em PDF contendo todas as emendas selecionadas.
 */
export function exportGeralPDF(emendas: Emenda[]): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = [15, 35, 80] as [number, number, number];
    const goldColor = [180, 130, 20] as [number, number, number];

    // Cabeçalho
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 297, 26, 'F');

    // Logo / Brasão Oficial da Câmara Municipal de Ubá
    try {
      const activeLogo = getActiveLogo();
      doc.addImage(activeLogo, 'PNG', 14, 3.5, 21, 19);
    } catch (e) {
      console.warn('Erro ao carregar brasão no PDF geral:', e);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('CÂMARA MUNICIPAL DE UBÁ - MINAS GERAIS', 38, 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('EMENDAS PARLAMENTARES IMPOSITIVAS - EXERCÍCIO DE 2026', 38, 16);

    const now = new Date();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Emissão: ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, 283, 16, { align: 'right' });

    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 26, 297, 1.5, 'F');

    const totalPrevisto = emendas.reduce((acc, e) => acc + e.valorPrevisto, 0);

    const tableBody = emendas.map((e) => [
      e.numero,
      e.vereador,
      e.area,
      e.tipoDespesa,
      e.entidadeBeneficiada || 'Administração Direta',
      e.objeto,
      e.valorPrevistoFormatado,
      (e.emendaExecutada && e.emendaExecutada.trim()) || '-',
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['N.º', 'Vereador(a) Autor(a)', 'Área', 'Tipo Despesa', 'Entidade / Beneficiário', 'Objeto da Emenda', 'Valor (R$)', 'Emenda Executada']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 35, 80],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 44, fontStyle: 'bold' },
        2: { cellWidth: 26 },
        3: { cellWidth: 26 },
        4: { cellWidth: 44, fontStyle: 'bold' },
        5: { cellWidth: 68 },
        6: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
        7: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 7) {
          const val = String(data.cell.raw).trim().toLowerCase();
          if (val === 'sim') {
            data.cell.styles.textColor = [22, 101, 52];
          } else if (val === 'não' || val === 'nao') {
            data.cell.styles.textColor = [190, 18, 60];
          }
        }
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.8,
        valign: 'top',
        lineColor: [226, 232, 240],
      },
      foot: [
        [
          '',
          `TOTAL GERAL (${emendas.length} emendas)`,
          '',
          '',
          '',
          '',
          formatCurrency(totalPrevisto),
          '',
        ],
      ],
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('Câmara Municipal de Ubá - MG • Sistema de Transparência Orçamentária', 14, 202);
        doc.text(`Página ${data.pageNumber} de ${pageCount}`, 283, 202, { align: 'right' });
      },
    });

    doc.save('relatorio-emendas-impositivas-uba-2026.pdf');
    return true;
  } catch (err) {
    console.error('Erro ao exportar PDF geral:', err);
    return false;
  }
}
