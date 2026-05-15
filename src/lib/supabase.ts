import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados (espelhando o schema SQL)
export type Database = {
  public: {
    Tables: {
      clinicas: {
        Row: { id: string; nome: string; cnpj: string | null; endereco: any; perfil_sensorial: any; created_at: string };
        Insert: { nome: string; cnpj?: string; endereco?: any; perfil_sensorial?: any };
        Update: { nome?: string; cnpj?: string; endereco?: any; perfil_sensorial?: any };
      };
      perfis: {
        Row: { id: string; nome: string; tipo: 'coordenador' | 'profissional' | 'familia'; avatar_url: string | null; clinica_id: string | null; telefone: string | null; created_at: string };
        Insert: { id: string; nome: string; tipo: 'coordenador' | 'profissional' | 'familia'; avatar_url?: string; clinica_id?: string; telefone?: string };
        Update: { nome?: string; tipo?: 'coordenador' | 'profissional' | 'familia'; avatar_url?: string; clinica_id?: string; telefone?: string };
      };
      pacientes: {
        Row: { id: string; clinica_id: string | null; nome: string; data_nascimento: string; diagnostico: string | null; nivel_suporte: number | null; perfil_sensorial: any; sistema_comunicacao: string; horarios_crise_historico: string[]; foto_url: string | null; ativo: boolean; created_at: string };
        Insert: { nome: string; data_nascimento: string; diagnostico?: string; nivel_suporte?: number; perfil_sensorial?: any; sistema_comunicacao?: string; horarios_crise_historico?: string[]; foto_url?: string; clinica_id?: string };
        Update: { nome?: string; data_nascimento?: string; diagnostico?: string; nivel_suporte?: number; perfil_sensorial?: any; sistema_comunicacao?: string; horarios_crise_historico?: string[]; foto_url?: string; ativo?: boolean };
      };
      profissionais: {
        Row: { id: string; perfil_id: string; clinica_id: string | null; registro_conselho: string | null; especialidades: string[]; metodos: string[]; disponibilidade: any; ativo: boolean; created_at: string };
        Insert: { perfil_id: string; clinica_id?: string; registro_conselho?: string; especialidades?: string[]; metodos?: string[]; disponibilidade?: any };
        Update: { registro_conselho?: string; especialidades?: string[]; metodos?: string[]; disponibilidade?: any; ativo?: boolean };
      };
      locais: {
        Row: { id: string; clinica_id: string | null; nome: string; tipo: string; perfil_sensorial: any; capacidade: number; area_escape: boolean; geolocalizacao: any; ativo: boolean; created_at: string };
        Insert: { nome: string; tipo: string; perfil_sensorial?: any; capacidade?: number; area_escape?: boolean; geolocalizacao?: any; clinica_id?: string };
        Update: { nome?: string; tipo?: string; perfil_sensorial?: any; capacidade?: number; area_escape?: boolean; geolocalizacao?: any; ativo?: boolean };
      };
      sessoes: {
        Row: { id: string; paciente_id: string; profissional_id: string; local_id: string; objetivo_id: string | null; data_hora: string; duracao_min: number; status: string; registro: any; checkin: any; checkout: any; created_at: string };
        Insert: { paciente_id: string; profissional_id: string; local_id: string; data_hora: string; duracao_min?: number; objetivo_id?: string };
        Update: { status?: string; registro?: any; checkin?: any; checkout?: any };
      };
      planos_terapeuticos: {
        Row: { id: string; paciente_id: string; versao: number; status: string; created_at: string };
        Insert: { paciente_id: string; versao?: number };
        Update: { versao?: number; status?: string };
      };
      objetivos: {
        Row: { id: string; plano_id: string; descricao: string; profissional_lider_id: string | null; meta: string | null; baseline: number | null; atual: number | null; unidade: string; status: string; created_at: string };
        Insert: { plano_id: string; descricao: string; profissional_lider_id?: string; meta?: string; baseline?: number; atual?: number; unidade?: string };
        Update: { descricao?: string; profissional_lider_id?: string; meta?: string; baseline?: number; atual?: number; unidade?: string; status?: string };
      };
      diario_bordo: {
        Row: { id: string; paciente_id: string; data: string; humor: string | null; sono: any; alimentacao: string | null; ocorrencias: any; registrado_por: string | null; registrado_por_tipo: string | null; created_at: string };
        Insert: { paciente_id: string; data?: string; humor?: string; sono?: any; alimentacao?: string; ocorrencias?: any; registrado_por?: string; registrado_por_tipo?: string };
        Update: { humor?: string; sono?: any; alimentacao?: string; ocorrencias?: any };
      };
      mensagens: {
        Row: { id: string; canal_id: string; autor_id: string; autor_tipo: string; conteudo: string; tipo_mensagem: string; metadata: any; created_at: string };
        Insert: { canal_id: string; autor_id: string; autor_tipo: string; conteudo: string; tipo_mensagem?: string; metadata?: any };
        Update: { conteudo?: string; metadata?: any };
      };
      posts_feed: {
        Row: { id: string; paciente_id: string; autor_id: string; autor_tipo: string; conteudo: string; tipo: string; midia_url: string | null; metadata: any; created_at: string };
        Insert: { paciente_id: string; autor_id: string; autor_tipo: string; conteudo: string; tipo?: string; midia_url?: string; metadata?: any };
        Update: { conteudo?: string; tipo?: string; midia_url?: string; metadata?: any };
      };
      generalizacao: {
        Row: { id: string; paciente_id: string; objetivo_id: string | null; descricao: string; concluido: boolean; registrado_por: string | null; data: string; created_at: string };
        Insert: { paciente_id: string; descricao: string; objetivo_id?: string; registrado_por?: string };
        Update: { concluido?: boolean; data?: string };
      };
      canais: {
        Row: { id: string; paciente_id: string; tipo: string; nome: string; created_at: string };
        Insert: { paciente_id: string; tipo: string; nome: string };
        Update: { nome?: string };
      };
    };
  };
};
