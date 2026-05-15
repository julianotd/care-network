// Tipos centrais do Care Network
export type UserRole = 'coordenador' | 'profissional' | 'familia';

export interface PerfilSensorial {
  hipersensitivo?: string[];
  hipossensitivo?: string[];
  iluminacao?: 'branca' | 'amarela' | 'dim';
  ruido?: 'silencioso' | 'medio' | 'alto';
  textura_piso?: string;
  area_escape?: boolean;
}

export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  diagnostico: string;
  nivelSuporte: 1 | 2 | 3;
  perfilSensorial: PerfilSensorial;
  sistemaComunicacao: string;
  horariosCrise: string[];
  humorHoje: string;
  fotoUrl?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  metodos: string[];
  registroConselho: string;
}

export interface Local {
  id: string;
  nome: string;
  tipo: 'clinica' | 'escola' | 'domicilio' | 'ar_livre';
  perfilSensorial: PerfilSensorial;
  capacidade: number;
  areaEscape: boolean;
}

export interface Sessao {
  id: string;
  pacienteId: string;
  profissionalId: string;
  localId: string;
  dataHora: string;
  duracaoMin: number;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  objetivoDescricao?: string;
  registro?: {
    humor?: string;
    notas?: string;
    dadosComportamento?: any[];
  };
}

export interface Objetivo {
  id: string;
  descricao: string;
  profissionalLiderId: string;
  meta: string;
  baseline: number;
  atual: number;
  unidade: string;
  status: 'em_andamento' | 'atingido' | 'suspenso';
  estrategias: Estrategia[];
}

export interface Estrategia {
  id: string;
  profissionalId: string;
  descricao: string;
}

export interface PlanoTerapeutico {
  id: string;
  pacienteId: string;
  versao: number;
  objetivos: Objetivo[];
}

export interface DiarioBordo {
  id: string;
  pacienteId: string;
  data: string;
  humor: string;
  sono: { horas: number; qualidade: string };
  alimentacao: string;
  ocorrencias: { tipo: string; descricao: string }[];
  registradoPor: string;
  registradoPorTipo: 'profissional' | 'familia';
}

export interface Mensagem {
  id: string;
  canalId: string;
  autorId: string;
  autorNome: string;
  autorTipo: UserRole;
  conteudo: string;
  tipoMensagem: 'texto' | 'video' | 'audio' | 'insight' | 'tarefa';
  createdAt: string;
}

export interface PostFeed {
  id: string;
  pacienteId: string;
  autorNome: string;
  autorTipo: UserRole;
  conteudo: string;
  tipo: 'registro' | 'video' | 'audio' | 'conquista' | 'comportamento';
  midiaUrl?: string;
  createdAt: string;
}

// Matching sensorial
export function calcularCompatibilidade(
  paciente: Paciente,
  local: Local
): number {
  let score = 0;
  const ps = paciente.perfilSensorial;
  const ls = local.perfilSensorial;

  // Hipersensitivo + ambiente ruidoso = conflito
  if (ps.hipersensitivo?.includes('auditivo') && ls.ruido === 'alto') score -= 3;
  if (ps.hipersensitivo?.includes('auditivo') && ls.ruido === 'silencioso') score += 2;

  // Iluminação
  if (ps.hipersensitivo?.includes('visual') && ls.iluminacao === 'branca') score -= 2;
  if (ps.hipersensitivo?.includes('visual') && ls.iluminacao === 'dim') score += 2;

  // Área de escape para suporte nível 2+
  if (paciente.nivelSuporte >= 2 && local.areaEscape) score += 3;

  // Tipo de local
  if (local.tipo === 'ar_livre' && ps.hipossensitivo?.includes('vestibular')) score += 2;

  return score;
}
