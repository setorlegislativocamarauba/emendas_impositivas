/**
 * Diretório e serviço de parlamentares da Câmara Municipal de Ubá - MG
 * Integração com dados e fotografias oficiais do SAPL (https://sapl.uba.mg.leg.br/parlamentar/)
 */

export interface ParlamentarInfo {
  id: number;
  nomeParlamentar: string;
  nomeCompleto: string;
  aliases: string[];
  ativo: boolean;
  fotoLocal: string;
  fotoSapl: string;
  saplUrl: string;
  partido?: string;
}

// Resolução de base path para compatibilidade perfeita com GitHub Pages (subdiretórios)
const BASE = import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' 
  ? import.meta.env.BASE_URL.replace(/\/$/, '') 
  : '';

export const PARLAMENTARES_UBA: ParlamentarInfo[] = [
  {
    id: 19,
    nomeParlamentar: 'Alexandre de Barros Mendes',
    nomeCompleto: 'Alexandre de Barros Mendes',
    aliases: ['alexandre de barros mendes', 'alexandre mendes', 'alexandre de barros'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/alexandre-de-barros-mendes.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/19/alexandre.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/19',
  },
  {
    id: 90,
    nomeParlamentar: 'Aline Moreira Silva Melo',
    nomeCompleto: 'Aline Moreira Silva Melo',
    aliases: ['aline moreira silva melo', 'aline moreira', 'aline melo'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/aline-moreira-silva-melo.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/90/ver_aline_5P83vQc.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/90',
  },
  {
    id: 114,
    nomeParlamentar: 'André Eustáquio Alves',
    nomeCompleto: 'André Eustáquio Alves',
    aliases: ['andre eustaquio alves', 'andre alves'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/andre-eustaquio-alves.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/114/andre_alves.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/114',
  },
  {
    id: 115,
    nomeParlamentar: 'Antonio Domingos Ximendes Trindade',
    nomeCompleto: 'Antonio Domingos Ximendes Trindade',
    aliases: ['antonio domingos ximendes trindade', 'antonio domingos', 'antonio ximendes'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/antonio-domingos-ximendes-trindade.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/115/antonio_domingos.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/115',
  },
  {
    id: 92,
    nomeParlamentar: 'Aparecida Sônia Ferreira Vidal',
    nomeCompleto: 'Aparecida Sônia Ferreira Vidal',
    aliases: ['aparecida sonia ferreira vidal', 'aparecida sonia', 'sonia vidal', 'aparecida vidal'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/aparecida-sonia-ferreira-vidal.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/92/aparecida_sonia.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/92',
  },
  {
    id: 113,
    nomeParlamentar: 'Breno Reis de Oliveira',
    nomeCompleto: 'Breno Reis de Oliveira',
    aliases: ['breno reis de oliveira', 'breno reis'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/breno-reis-de-oliveira.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/113/breno_reis.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/113',
  },
  {
    id: 95,
    nomeParlamentar: 'Celinho Lopes',
    nomeCompleto: 'Célio Lopes dos Santos',
    aliases: ['celinho lopes', 'celio lopes dos santos', 'celio lopes', 'celinho'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/celinho-lopes.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/95/dsc_0379.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/95',
  },
  {
    id: 18,
    nomeParlamentar: 'Edeir Pacheco',
    nomeCompleto: 'Edeir Pacheco da Costa',
    aliases: ['edeir pacheco', 'edeir pacheco da costa'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/edeir-pacheco.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/18/edeir_pacheco.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/18',
  },
  {
    id: 22,
    nomeParlamentar: 'Gilson Fazolla Filgueiras',
    nomeCompleto: 'Gilson Fazolla Filgueiras',
    aliases: ['gilson fazolla filgueiras', 'gilson fazolla', 'fazolla'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/gilson-fazolla-filgueiras.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/22/gilson_fazolla.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/22',
  },
  {
    id: 17,
    nomeParlamentar: 'Jane Cristina Lacerda Pinto',
    nomeCompleto: 'Jane Cristina Lacerda Pinto',
    aliases: ['jane cristina lacerda pinto', 'jane cristina', 'jane lacerda'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/jane-cristina-lacerda-pinto.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/17/jane_crisitna.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/17',
  },
  {
    id: 94,
    nomeParlamentar: 'José Carlos do Sindicato',
    nomeCompleto: 'José Carlos Reis Pereira',
    aliases: ['jose carlos reis pereira', 'jose carlos do sindicato', 'jose carlos'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/jose-carlos-do-sindicato.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/94/jose_carlos.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/94',
  },
  {
    id: 91,
    nomeParlamentar: 'Professor José Damato',
    nomeCompleto: 'José Damato Neto',
    aliases: ['jose damato neto', 'professor jose damato', 'jose damato', 'prof jose damato'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/professor-jose-damato.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/91/jose_damato.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/91',
  },
  {
    id: 93,
    nomeParlamentar: 'José Maria Fernandes',
    nomeCompleto: 'José Maria Fernandes',
    aliases: ['jose maria fernandes', 'jose maria'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/jose-maria-fernandes.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/93/ver_jose_maria.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/93',
  },
  {
    id: 21,
    nomeParlamentar: 'José Roberto Reis Filgueiras',
    nomeCompleto: 'José Roberto Reis Filgueiras',
    aliases: [
      'jose roberto filgueiras',
      'jose roberto reis filgueiras',
      'jose roberto',
      'roberto filgueiras',
    ],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/jose-roberto-reis-filgueiras.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/21/jose_roberto.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/21',
  },
  {
    id: 110,
    nomeParlamentar: 'Lucas Rufino Zocoli',
    nomeCompleto: 'Lucas Rufino Zocoli',
    aliases: ['lucas rufino zocoli', 'lucas zocoli', 'lucas rufino'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/lucas-rufino-zocoli.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/110/ver_lucas.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/110',
  },
  {
    id: 117,
    nomeParlamentar: 'Marilda Aparecida Leoncio',
    nomeCompleto: 'Marilda Aparecida Leoncio',
    aliases: ['marilda aparecida leoncio', 'marilda leoncio'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/marilda-aparecida-leoncio.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/117/marilda.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/117',
  },
  {
    id: 109,
    nomeParlamentar: 'Paulo Cézar Tavares',
    nomeCompleto: 'Paulo Cézar Tavares',
    aliases: ['paulo cezar tavares', 'paulo tavares', 'paulo cezar'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/paulo-cezar-tavares.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/109/ver_paulo.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/109',
  },
  {
    id: 111,
    nomeParlamentar: 'Renato Vieira',
    nomeCompleto: 'Renato Vieira',
    aliases: ['renato vieira'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/renato-vieira.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/111/renato_vieira.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/111',
  },
  {
    id: 112,
    nomeParlamentar: 'Samuel Soares da Silva',
    nomeCompleto: 'Samuel Soares da Silva',
    aliases: ['samuel soares da silva', 'samuel soares'],
    ativo: true,
    fotoLocal: `${BASE}/fotos-parlamentares/samuel-soares-da-silva.jpg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/112/ver_samuel.jpg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/112',
  },
  {
    id: 116,
    nomeParlamentar: 'Angela Cristina de Avelar Simões',
    nomeCompleto: 'Angela Cristina de Avelar Simões',
    aliases: ['angela cristina de avelar simoes', 'angela simoes', 'angela cristina'],
    ativo: true,
    fotoLocal: '',
    fotoSapl: '',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/116',
  },
  // Históricos adicionais com foto no SAPL
  {
    id: 20,
    nomeParlamentar: 'Antero Gomes de Aguiar',
    nomeCompleto: 'Antero Gomes de Aguiar',
    aliases: ['antero gomes de aguiar', 'antero gomes'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/antero-gomes-de-aguiar.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/20/20_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/20',
  },
  {
    id: 12,
    nomeParlamentar: 'Carlos da Silva Rufato',
    nomeCompleto: 'Carlos da Silva Rufato',
    aliases: ['carlos da silva rufato', 'carlos rufato'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/carlos-da-silva-rufato.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/12/12_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/12',
  },
  {
    id: 9,
    nomeParlamentar: 'Célio Botaro',
    nomeCompleto: 'Célio Botaro',
    aliases: ['celio botaro'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/celio-botaro.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/9/9_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/9',
  },
  {
    id: 8,
    nomeParlamentar: 'Darci Pires da Silva',
    nomeCompleto: 'Darci Pires da Silva',
    aliases: ['darci pires da silva', 'darci pires'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/darci-pires-da-silva.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/8/8_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/8',
  },
  {
    id: 6,
    nomeParlamentar: 'Jorge Custódio Gervásio',
    nomeCompleto: 'Jorge Custódio Gervásio',
    aliases: ['jorge custodio gervasio', 'jorge custodio'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/jorge-custodio-gervasio.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/6/6_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/6',
  },
  {
    id: 11,
    nomeParlamentar: 'José Alves Germano',
    nomeCompleto: 'José Alves Germano',
    aliases: ['jose alves germano', 'jose germano'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/jose-alves-germano.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/11/11_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/11',
  },
  {
    id: 15,
    nomeParlamentar: 'Joseli Anísio Pinto',
    nomeCompleto: 'Joseli Anísio Pinto',
    aliases: ['joseli anisio pinto', 'joseli pinto'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/joseli-anisio-pinto.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/15/15_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/15',
  },
  {
    id: 16,
    nomeParlamentar: 'Luis Carlos Teixeira Ribeiro',
    nomeCompleto: 'Luis Carlos Teixeira Ribeiro',
    aliases: ['luis carlos teixeira ribeiro', 'luis carlos ribeiro'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/luis-carlos-teixeira-ribeiro.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/16/16_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/16',
  },
  {
    id: 5,
    nomeParlamentar: 'Mauricio Valadão Reimão de Melo',
    nomeCompleto: 'Mauricio Valadão Reimão de Melo',
    aliases: ['mauricio valadao reimao de melo', 'mauricio valadao'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/mauricio-valadao-reimao-de-melo.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/5/5_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/5',
  },
  {
    id: 7,
    nomeParlamentar: 'Oswaldo Peixoto Guimarães',
    nomeCompleto: 'Oswaldo Peixoto Guimarães',
    aliases: ['oswaldo peixoto guimaraes', 'oswaldo peixoto'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/oswaldo-peixoto-guimaraes.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/7/7_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/7',
  },
  {
    id: 2,
    nomeParlamentar: 'Rafael Paulo de Freitas',
    nomeCompleto: 'Rafael Paulo de Freitas',
    aliases: ['rafael paulo de freitas', 'rafael freitas'],
    ativo: false,
    fotoLocal: `${BASE}/fotos-parlamentares/rafael-paulo-de-freitas.jpeg`,
    fotoSapl: 'https://sapl.uba.mg.leg.br/media/sapl/public/parlamentar/2/2_foto_parlamentar.jpeg',
    saplUrl: 'https://sapl.uba.mg.leg.br/parlamentar/2',
  },
];

/**
 * Normaliza strings para comparação flexível (remove acentos, pontuação e espaços extras)
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrai iniciais do nome para avatar fallback
 */
export function getInitials(name: string): string {
  if (!name) return 'CM';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Localiza informações completas e foto do parlamentar por qualquer variação do nome
 */
export function findParlamentar(rawName: string): ParlamentarInfo | undefined {
  if (!rawName) return undefined;
  const clean = normalizeName(rawName);

  // 1. Busca exata em aliases, nome parlamentar ou nome completo
  const exact = PARLAMENTARES_UBA.find(
    (p) =>
      normalizeName(p.nomeParlamentar) === clean ||
      normalizeName(p.nomeCompleto) === clean ||
      p.aliases.some((alias) => normalizeName(alias) === clean)
  );
  if (exact) return exact;

  // 2. Busca parcial (um contém o outro)
  const partial = PARLAMENTARES_UBA.find((p) => {
    const np = normalizeName(p.nomeParlamentar);
    const nc = normalizeName(p.nomeCompleto);
    return clean.includes(np) || np.includes(clean) || clean.includes(nc) || nc.includes(clean);
  });
  if (partial) return partial;

  // 3. Busca por primeiro e último nome
  const parts = clean.split(' ');
  if (parts.length >= 2) {
    const firstLast = `${parts[0]} ${parts[parts.length - 1]}`;
    const matchFirstLast = PARLAMENTARES_UBA.find((p) => {
      const np = normalizeName(p.nomeParlamentar);
      const partsP = np.split(' ');
      const pFirstLast = `${partsP[0]} ${partsP[partsP.length - 1]}`;
      return firstLast === pFirstLast;
    });
    if (matchFirstLast) return matchFirstLast;
  }

  return undefined;
}
