# Câmara Municipal de Ubá - Portal de Emendas Parlamentares Impositivas

Sistema oficial de transparência, acompanhamento e emissão de relatórios das Emendas Parlamentares Impositivas da **Câmara Municipal de Ubá - Estado de Minas Gerais**.

---

## 🌐 Publicação no GitHub Pages (Como ativar o site)

A tela ficou em branco quando você ativou o GitHub Pages porque o GitHub tentou abrir os arquivos de desenvolvimento da raiz (`/src/main.tsx`), que os navegadores não executam sem compilação prévia do React/TypeScript.

Você pode resolver isso em **menos de 1 minuto** escolhendo qualquer uma das opções abaixo:

### ✅ Opção 1: Usando GitHub Actions (Recomendado - 100% Automático)
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment** > **Source**, troque de *"Deploy from a branch"* para **GitHub Actions**.
4. Pronto! O fluxo já configurado em `.github/workflows/deploy.yml` irá compilar e publicar o site automaticamente.

### ✅ Opção 2: Usando a pasta `/docs` (Deploy direto da branch)
1. No seu repositório no GitHub, vá em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, mantenha *"Deploy from a branch"*.
3. Em **Branch**, mantenha `main` e, no seletor de pasta ao lado, mude de `/ (root)` para **/docs**.
4. Clique em **Save**. Em 1 a 2 minutos seu site estará no ar e funcionando perfeitamente!

---

## 🏛️ Sobre o Projeto

Este portal foi desenvolvido para dar total transparência, controle social e agilidade no acesso às informações sobre as emendas impositivas destinadas pelos vereadores no orçamento municipal.

### Principais Recursos
* **Sincronização em Tempo Real**: Conexão direta com a planilha oficial do Google Sheets da Câmara Municipal de Ubá.
* **Contingência Offline**: Base de dados oficial embutida para funcionamento contínuo mesmo sem conexão externa.
* **Relatórios Oficiais em PDF**:
  * Relatório individual diagramado por vereador com Brasão Oficial da Câmara, métricas e status de execução (**Coluna AF** da planilha oficial).
  * Relatório geral consolidado de todas as emendas aprovadas.
* **Exportação Multiformato**: Download em Excel (.xls) com formatação rica e em arquivo CSV com codificação UTF-8 BOM.
* **Ficha Técnica Detalhada**: Detalhamento de ficha orçamentária, programas, ações e link direto para o SAPL de cada parlamentar.
* **Acessibilidade Completa**: Suporte a modo alto contraste, controle de tamanho de fonte e sintetizador de voz (áudio acessível).
* **Gestão de Brasão e Identidade Visual**: Brasão oficial com fundo transparente integrado e ferramenta para upload de novas versões PNG.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm** ou **yarn** / **bun**

### Instalação

1. Clone o repositório ou descompacte o arquivo zip:
```bash
git clone https://github.com/seu-usuario/emendas-impositivas-uba.git
cd emendas-impositivas-uba
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no seu navegador:
```
http://localhost:3000
```

---

## 📦 Scripts Disponíveis

* `npm run dev` - Inicia o servidor local de desenvolvimento na porta 3000.
* `npm run build` - Compila o projeto em arquivos estáticos otimizados para produção na pasta `dist/` e atualiza `docs/`.
* `npm run preview` - Visualiza a versão de produção localmente.
* `npm run lint` - Executa a verificação de tipos e sintaxe com TypeScript.

---

## ⚙️ Configuração para Novos Exercícios (2026, 2027, ...)

Para alterar o ano do exercício ou vincular uma nova planilha do Google Sheets, basta editar o arquivo:

`src/config/sheetConfig.ts`:
```typescript
// Ano do exercício financeiro/legislativo
export const EXERCICIO_ATUAL = '2026';

// Link da planilha oficial publicada do Google Sheets
export const FIXED_GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID/edit?gid=0#gid=0';
```

---

## 🛠️ Tecnologias Utilizadas

* **React 19** com **TypeScript**
* **Vite** para build ultrarrápido
* **Tailwind CSS v4** para design responsivo e acessível
* **jsPDF** & **jspdf-autotable** para geração de relatórios oficiais em PDF
* **Lucide React** para iconografia moderna

---

## 📄 Licença

Desenvolvido para a **Câmara Municipal de Ubá - MG**. Livre para uso institucional e transparência pública.
