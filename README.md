# 🌸 Pura Vitrine • Marketing para Salões

Plataforma inteligente de gestão de mídias sociais, geração de copy com inteligência artificial (**Google Gemini 3.1 Flash Lite**), biblioteca de mídia, calendário editorial e métricas executivas voltada para salões de beleza de alto padrão.

---

## ✨ Principais Funcionalidades

- **Dashboard Executivo**: Métricas em tempo real, alcance semanal, taxa de engajamento, status de postagens e troca de filiais ativas.
- **Editor de Post & IA Generativa**: Geração automática de legendas sofisticadas com emojis refinados e blocos de hashtags segmentadas com base no Google Gemini.
- **Mockup Interativo do Instagram**: Pré-visualização em tempo real de posts em Feed 4:5 e Stories 9:16 com simulação de curtidas e comentários.
- **Biblioteca de Mídia Inteligente**: Upload de fotos e vídeos com auto-tagging de procedimentos de salão (Mechas, Morena Iluminada, Nail Art, etc.).
- **Calendário Editorial**: Visão mensal e semanal da grade de publicações com horários de pico.
- **Métricas & Relatórios**: Análise de eficiência por formato (Reels, Carrossel, Stories), demografia de clientes por bairros e leaderboard de posts mais engajados.
- **TikTok Creative Center (Tendências de Beleza)**: Monitoramento em tempo real de hashtags virais (#hairtok, acidificação, morena iluminada, corte butterfly), métricas de crescimento, ganchos de 3 segundos (hooks) e gerador de roteiros cronometrados com Google Gemini.
- **Guia de Utilização Oficial**: Manual interativo com guia passo a passo, boas práticas de fotografia para salão, estratégias de Reels/TikTok e FAQ.
- **Gerenciador de Chaves de API**: Painel seguro na tela de login para configuração das APIs (.env.local / Vercel).

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS** com sistema de tokens Stitch Luxury
- **Prisma ORM 7** com PostgreSQL Adapter
- **Google Generative AI SDK** (Gemini 3.1 Flash Lite)
- **TypeScript**

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/JEMAM/Pura-Vitrine.git
cd Pura-Vitrine
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo de variáveis de ambiente:
```bash
cp .env.example .env.local
```
Preencha a sua `GEMINI_API_KEY` obtida no [Google AI Studio](https://aistudio.google.com/app/apikey).

4. Gere o cliente Prisma e execute o servidor:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.  
**Acesso Padrão:** `admin@salao.com` / `admin123`

---

## ☁️ Deploy na Vercel

1. Importe o repositório na [Vercel](https://vercel.com).
2. Configure as seguintes variáveis em **Project Settings > Environment Variables**:
   - `GEMINI_API_KEY`: Sua chave de API do Google Gemini.
   - `NEXTAUTH_SECRET`: Segredo de sessão (qualquer hash de 32+ caracteres).
   - `NEXTAUTH_URL`: URL do seu app (ex: `https://puravitrine.vercel.app`).
   - `DATABASE_URL`: Conexão com banco PostgreSQL remoto (opcional se usar banco local).
3. O build e a inicialização ocorrem de forma 100% automatizada.
