-- =============================================================
-- Care Network — Schema Inicial (PostgreSQL + Supabase)
-- Ecossistema de cuidado em rede para TEA/Desenvolvimento
-- =============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================
-- ORGANIZAÇÃO
-- =============================================================
CREATE TABLE clinicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  endereco JSONB,
  perfil_sensorial JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- USUÁRIOS (Auth via Supabase Auth)
-- =============================================================
CREATE TABLE perfis (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('coordenador','profissional','familia')),
  avatar_url TEXT,
  clinica_id UUID REFERENCES clinicas(id),
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- PROFISSIONAIS
-- =============================================================
CREATE TABLE profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id UUID REFERENCES perfis(id) ON DELETE CASCADE,
  clinica_id UUID REFERENCES clinicas(id),
  registro_conselho TEXT,
  especialidades TEXT[] DEFAULT '{}',
  metodos TEXT[] DEFAULT '{}',
  disponibilidade JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- PACIENTES
-- =============================================================
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID REFERENCES clinicas(id),
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  diagnostico TEXT,
  nivel_suporte SMALLINT CHECK (nivel_suporte BETWEEN 1 AND 3),
  perfil_sensorial JSONB DEFAULT '{}',
  sistema_comunicacao TEXT DEFAULT 'verbal',
  horarios_crise_historico TEXT[] DEFAULT '{}',
  foto_url TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Círculo de cuidado (N:N paciente ↔ profissional)
CREATE TABLE circulo_cuidado (
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES profissionais(id) ON DELETE CASCADE,
  papel TEXT DEFAULT 'terapeuta',
  PRIMARY KEY (paciente_id, profissional_id)
);

-- Responsáveis / Família
CREATE TABLE responsaveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  perfil_id UUID REFERENCES perfis(id) ON DELETE CASCADE,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  parentesco TEXT NOT NULL,
  autorizacoes JSONB DEFAULT '{"foto": false, "video": false, "notas": true}'
);

-- =============================================================
-- LOCAIS
-- =============================================================
CREATE TABLE locais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinica_id UUID REFERENCES clinicas(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('clinica','escola','domicilio','ar_livre')),
  perfil_sensorial JSONB DEFAULT '{}',
  capacidade SMALLINT DEFAULT 1,
  area_escape BOOLEAN DEFAULT FALSE,
  geolocalizacao JSONB,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- PLANO TERAPÊUTICO INTEGRADO (PTI)
-- =============================================================
CREATE TABLE planos_terapeuticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  versao SMALLINT DEFAULT 1,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo','arquivado','rascunho')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE objetivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plano_id UUID REFERENCES planos_terapeuticos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  profissional_lider_id UUID REFERENCES profissionais(id),
  meta TEXT,
  baseline NUMERIC,
  atual NUMERIC,
  unidade TEXT DEFAULT 'frequencia/dia',
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento','atingido','suspenso')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE estrategias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  objetivo_id UUID REFERENCES objetivos(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES profissionais(id),
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- SESSÕES / AGENDA
-- =============================================================
CREATE TABLE sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id),
  profissional_id UUID REFERENCES profissionais(id),
  local_id UUID REFERENCES locais(id),
  objetivo_id UUID REFERENCES objetivos(id),
  data_hora TIMESTAMPTZ NOT NULL,
  duracao_min SMALLINT DEFAULT 60,
  status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada','em_andamento','concluida','cancelada','faltou')),
  registro JSONB DEFAULT '{}',
  checkin JSONB,
  checkout JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- DIÁRIO DE BORDO
-- =============================================================
CREATE TABLE diario_bordo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  humor TEXT,
  sono JSONB DEFAULT '{}',
  alimentacao TEXT,
  ocorrencias JSONB DEFAULT '[]',
  registrado_por UUID,
  registrado_por_tipo TEXT CHECK (registrado_por_tipo IN ('profissional','familia')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- CHAT SEGMENTADO
-- =============================================================
CREATE TABLE canais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('comunicacao','sensorial','rotina','geral')),
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canal_id UUID REFERENCES canais(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL,
  autor_tipo TEXT NOT NULL CHECK (autor_tipo IN ('profissional','familia','coordenador')),
  conteudo TEXT NOT NULL,
  tipo_mensagem TEXT DEFAULT 'texto' CHECK (tipo_mensagem IN ('texto','video','audio','insight','tarefa')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes do canal
CREATE TABLE canal_participantes (
  canal_id UUID REFERENCES canais(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL,
  PRIMARY KEY (canal_id, usuario_id)
);

-- =============================================================
-- FEED DE EVOLUÇÃO
-- =============================================================
CREATE TABLE posts_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL,
  autor_tipo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo TEXT DEFAULT 'registro' CHECK (tipo IN ('registro','video','audio','conquista','comportamento')),
  midia_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- CHECKLIST DE GENERALIZAÇÃO
-- =============================================================
CREATE TABLE generalizacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id),
  objetivo_id UUID REFERENCES objetivos(id),
  descricao TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  registrado_por UUID,
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- RLS (Row Level Security)
-- =============================================================
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE diario_bordo ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_terapeuticos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (expandir conforme necessidade)
CREATE POLICY "perfis_own" ON perfis FOR ALL USING (id = auth.uid());
CREATE POLICY "clinica_isolation" ON pacientes FOR ALL
  USING (clinica_id IN (SELECT clinica_id FROM perfis WHERE id = auth.uid()));

-- =============================================================
-- ÍNDICES
-- =============================================================
CREATE INDEX idx_sessoes_paciente ON sessoes(paciente_id, data_hora);
CREATE INDEX idx_sessoes_profissional ON sessoes(profissional_id, data_hora);
CREATE INDEX idx_diario_paciente ON diario_bordo(paciente_id, data);
CREATE INDEX idx_mensagens_canal ON mensagens(canal_id, created_at);
CREATE INDEX idx_feed_paciente ON posts_feed(paciente_id, created_at DESC);
