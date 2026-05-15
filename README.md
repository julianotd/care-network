# 🤝 Care Network

**Ecossistema de Cuidado em Rede para TEA e Desenvolvimento**

Um sistema que não é uma agenda, mas sim um ecossistema de cuidado em rede. Onde a agenda entende as necessidades sensoriais de cada local, a interação entre profissionais é colaborativa e não conflituosa, e a família deixa de ser mera espectadora para ser copilota ativa do tratamento.

---

## ✨ Features

### 🏠 Dashboard
- Visão do dia com sessões concluídas/em andamento/restantes
- Feed de evolução em tempo real
- Seleção rápida de paciente com humor atual

### 📅 Agenda com Inteligência Sensorial
- Timeline visual com sessões do dia
- **Matching automático** paciente × local (algoritmo de compatibilidade sensorial)
- Mapa de calor de tolerância por horário (evita agendar em picos de crise)
- Indicador visual de compatibilidade (✅/⚠️/🔴)

### 👤 Perfil do Paciente
- Perfil sensorial detalhado (hipersensitivo/hipossensitivo)
- Locais compatíveis com score de matching
- Horários de pico de crise identificados
- Resumo do plano terapêutico com progresso visual

### 📱 Feed de Evolução
- Posts estilo "rede social" com conquistas, vídeos e áudios
- Tipos: registro, vídeo 15s, áudio, conquista, comportamento
- Interações: curtir, comentar, salvar

### 💬 Chat Segmentado por Tópico
- **Canal Comunicação**: Fono + ABA + PECS
- **Canal Sensorial**: TO + Psicologia
- **Canal Rotina**: Todos + Escola
- Mensagens tipo "insight" geram tarefas automaticamente

### 📔 Diário de Bordo
- Registro rápido com emojis de humor (😊😐😢😡😴⚡)
- Sono, alimentação e ocorrências
- **Correlações automáticas** (IA encontra padrões):
  - "Sessões pós-almoço têm 80% mais engajamento quando sono > 8h"
  - "Dias com humor 😊 = 3x mais uso de PECS"

### 📋 Plano Terapêutico Integrado (PTI)
- Objetivos com baseline, meta e progresso visual
- Estratégias atribuídas por profissional
- Versionamento e histórico
- Colaboração em tempo real entre profissionais

### ✅ Checklist de Generalização
- Família marca em casa o que funciona
- Notificação automática para o profissional
- Taxa de generalização calculada
- Itens organizados por objetivo terapêutico

### 🚨 Protocolo de Crise
- Botão "EM CRISE" com notificação automática
- Notifica profissional mais próximo + coordenação
- Protocolo ABA passo a passo
- Histórico de crises com gatilhos e resoluções

### 📄 Relatórios Automáticos
- Geração para: Família, Escola, Plano de Saúde, Laudo Pericial
- Gráficos de evolução por comportamento-alvo
- Resumo do diário de bordo
- Exportação em PDF

### 💰 Financeiro
- Tarifas por tipo de atendimento (clínica/domiciliar/teleatendimento/escola)
- Multiplicador por profissional/especialidade
- Faturamento do dia, projeção mensal, pendências
- Tabela de sessões faturadas

### 🔄 Substituição Consciente
- Sugestão de substituto quando profissional falta
- Score de compatibilidade baseado em:
  - Métodos em comum (×3)
  - Especialidades (×2)
  - Já conhece o paciente (×5)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│           Next.js 15 (App Router)            │
│         React 19 · TypeScript · Tailwind 4   │
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

# Copiar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase

# Rodar em dev
npm run dev

# Build
npm run build
```

## 🗄️ Banco de Dados

O schema completo está em `supabase/migrations/001_initial_schema.sql`.

**15 tabelas** com:
- Row-Level Security (RLS) para isolamento por clínica
- Políticas de acesso por círculo de cuidado
- Índices otimizados para consultas frequentes
- JSONB flexível para perfis sensoriais

Para aplicar no Supabase:
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL no SQL Editor
3. Configure as variáveis de ambiente em `.env.local`

## 📁 Estrutura

```
care-network/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── page.tsx                # Dashboard principal com 12 abas
│   │   └── globals.css             # Tailwind
│   ├── components/
│   │   ├── Dashboard.tsx           # Visão geral do dia
│   │   ├── Agenda.tsx              # Timeline com matching sensorial
│   │   ├── PacienteView.tsx        # Perfil completo do paciente
│   │   ├── Feed.tsx                # Feed de evolução
│   │   ├── Chat.tsx                # Chat segmentado por tópico
│   │   ├── DiarioBordo.tsx         # Diário com emojis + correlações
│   │   ├── PlanoTerapeutico.tsx    # PTI colaborativo
│   │   ├── Generalizacao.tsx       # Checklist de generalização
│   │   ├── Relatorios.tsx          # Relatórios automáticos
│   │   ├── Crise.tsx               # Protocolo de crise
│   │   ├── Financeiro.tsx          # Gestão financeira
│   │   └── Substituicao.tsx        # Substituição consciente
│   └── lib/
│       ├── types.ts                # Tipos + algoritmo de matching
│       ├── mock-data.ts            # Dados de demonstração
│       └── supabase.ts             # Cliente Supabase + tipos
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo PostgreSQL
├── .env.example                    # Variáveis de ambiente
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

### ✅ v0.1 — MVP
- [x] Dashboard com visão do dia
- [x] Agenda com matching sensorial
- [x] Perfil do paciente com perfil sensorial
- [x] Feed de evolução
- [x] Chat segmentado por tópico
- [x] Diário de bordo com emojis
- [x] Plano terapêutico colaborativo

### ✅ v0.2 — Expansão
- [x] Checklist de generalização
- [x] Relatórios automáticos (escola, plano de saúde, laudo)
- [x] Protocolo de crise com notificação
- [x] Módulo financeiro
- [x] Substituição consciente de profissional
- [x] Integração Supabase (tipos + cliente)

### 🔄 v0.3 — Inteligência
- [ ] Auth completa (Supabase Auth)
- [ ] Realtime (chat + feed em tempo real)
- [ ] Agenda preditiva com IA
- [ ] Modo Não-verbal First
- [ ] Integração com wearables
- [ ] Upload de mídia (vídeo/áudio)

### 🔄 v0.4 — Produção
- [ ] Testes automatizados
- [ ] CI/CD
- [ ] Monitoramento
- [ ] Performance optimization
- [ ] PWA (offline first)

---

**Feito com ❤️ para a comunidade TEA**
