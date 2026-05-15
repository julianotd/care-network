# 🤝 Care Network

**Ecossistema de Cuidado em Rede para TEA e Desenvolvimento**

Um sistema que não é uma agenda, mas sim um ecossistema de cuidado em rede. Onde a agenda entende as necessidades sensoriais de cada local, a interação entre profissionais é colaborativa e não conflituosa, e a família deixa de ser mera espectadora para ser copilota ativa do tratamento.

## ✨ Diferenciais

### 🧠 Agenda com Inteligência Sensorial
- Perfil sensorial de cada local (iluminação, ruído, textura, área de escape)
- Perfil sensorial de cada paciente (hipersensitivo/hipossensitivo)
- **Matching automático**: o sistema sugere o melhor local × paciente × horário
- Mapa de calor de tolerância por horário (evita agendar em picos de crise)

### 🤝 Colaboração Interprofissional
- Plano Terapêutico Integrado (PTI) compartilhado e versionado
- Chat segmentado por tópico terapêutico (Comunicação / Sensorial / Rotina)
- Notificação de sobreposição de cuidados (estratégias conflitantes)
- Substituição consciente de profissional

### 👨‍👩‍👧 Família como Copilota
- Feed de evolução estilo "rede social" com vídeos, áudios e conquistas
- Diário de bordo com emojis de humor (ácil, intuitivo)
- Checklist de generalização (família marca o que funciona em casa)
- Correlações automáticas (IA encontra padrões nos dados)

### 📊 Baseado em Evidências
- Suporte a protocolos ABA (DTT, NET, DRA, PECS)
- Estruturas TEACCH (rotinas visuais, sistemas de trabalho)
- Coleta sistemática de dados (frequência, duração, latência)
- Relatórios automáticos para escolas, laudos e planos de saúde

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│           Next.js (App Router)               │
│         React · TypeScript · Tailwind        │
├─────────────────────────────────────────────┤
│              Supabase                        │
│   PostgreSQL · Auth · Realtime · Storage     │
├─────────────────────────────────────────────┤
│          Motor de Matching                   │
│   Algoritmo de compatibilidade sensorial     │
├─────────────────────────────────────────────┤
│          Camada LGPD                         │
│   Círculos de cuidado · RLS · Consentimento  │
└─────────────────────────────────────────────┘
```

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Charts | Recharts |
| Icons | Lucide React |
| Deploy | Vercel |

## 📦 Setup

```bash
# Instalar dependências
npm install

# Rodar em dev
npm run dev

# Build
npm run build
```

## 🗄️ Banco de Dados

O schema completo está em `supabase/migrations/001_initial_schema.sql`.

Para aplicar no Supabase:
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL no SQL Editor
3. Configure as variáveis de ambiente

## 📁 Estrutura

```
care-network/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raiz
│   │   ├── page.tsx            # Dashboard principal
│   │   └── globals.css         # Estilos globais
│   ├── components/
│   │   ├── Dashboard.tsx       # Visão geral do dia
│   │   ├── Agenda.tsx          # Timeline com matching sensorial
│   │   ├── PacienteView.tsx    # Perfil completo do paciente
│   │   ├── Feed.tsx            # Feed de evolução
│   │   ├── Chat.tsx            # Chat segmentado por tópico
│   │   ├── DiarioBordo.tsx     # Diário com emojis + correlações
│   │   └── PlanoTerapeutico.tsx # PTI colaborativo
│   └── lib/
│       ├── types.ts            # Tipos TypeScript + algoritmo de matching
│       └── mock-data.ts        # Dados de demonstração
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo PostgreSQL
├── package.json
└── README.md
```

## 🔒 LGPD

- **Círculos de cuidado**: acesso granular por papel (família / profissional / coordenação)
- **Row-Level Security (RLS)**: isolamento por clínica no nível do banco
- **Consentimento digital**: família autoriza cada tipo de dado (foto, vídeo, notas)
- **Criptografia**: dados sensíveis criptografados em repouso

## 📊 Modelo de Monetização

| Plano | Preço | Público |
|-------|-------|---------|
| Família | Grátis | Pais/responsáveis (gera demanda) |
| Profissional | R$89-199/mês | Terapeutas individuais |
| Clínica | R$29-59/paciente | Clínicas pequenas/médias |
| Enterprise | Custom | Redes de clínicas, hospitais |

## 🛣️ Roadmap

### ✅ MVP (v0.1)
- [x] Dashboard com visão do dia
- [x] Agenda com matching sensorial
- [x] Perfil do paciente com perfil sensorial
- [x] Feed de evolução
- [x] Chat segmentado por tópico
- [x] Diário de bordo com emojis
- [x] Plano terapêutico colaborativo

### 🔄 v0.2
- [ ] Integração Supabase (auth + realtime)
- [ ] Relatórios automáticos
- [ ] Substituição consciente de profissional
- [ ] Checklist de generalização

### 🔄 v0.3
- [ ] Agenda preditiva com IA
- [ ] Modo Não-verbal First
- [ ] Integração com wearables
- [ ] Botão "Estou em Crise"

---

**Feito com ❤️ para a comunidade TEA**
