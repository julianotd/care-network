import { Paciente, Profissional, Local, Sessao, PlanoTerapeutico, DiarioBordo, PostFeed, Mensagem } from './types';

export const PROFISSIONAIS: Profissional[] = [
  { id: 'p1', nome: 'Dra. Marina Silva', especialidades: ['ABA', 'Comportamento'], metodos: ['DTT', 'NET'], registroConselho: 'CRP 12345' },
  { id: 'p2', nome: 'Dr. Rafael Costa', especialidades: ['TO', 'Sensorial'], metodos: ['TEACCH', 'Integração Sensorial'], registroConselho: 'CREFITO 67890' },
  { id: 'p3', nome: 'Ana Beatriz Souza', especialidades: ['Fonoaudiologia'], metodos: ['PECS', 'PROMPT'], registroConselho: 'CRFa 11111' },
  { id: 'p4', nome: 'Psic. Lucas Mendes', especialidades: ['Psicologia', 'ABA'], metodos: ['ABA', 'ABA Verbal'], registroConselho: 'CRP 22222' },
];

export const LOCAIS: Local[] = [
  { id: 'l1', nome: 'Sala Sensorial A', tipo: 'clinica', perfilSensorial: { iluminacao: 'dim', ruido: 'silencioso', textura_piso: 'macio', area_escape: true }, capacidade: 1, areaEscape: true },
  { id: 'l2', nome: 'Sala Multiuso B', tipo: 'clinica', perfilSensorial: { iluminacao: 'branca', ruido: 'medio', textura_piso: 'ceramica', area_escape: false }, capacidade: 2, areaEscape: false },
  { id: 'l3', nome: 'Área Externa', tipo: 'ar_livre', perfilSensorial: { iluminacao: 'branca', ruido: 'medio', textura_piso: 'grama', area_escape: true }, capacidade: 3, areaEscape: true },
  { id: 'l4', nome: 'Domicílio - Família Oliveira', tipo: 'domicilio', perfilSensorial: { iluminacao: 'amarela', ruido: 'silencioso', textura_piso: 'madeira', area_escape: true }, capacidade: 1, areaEscape: true },
];

export const PACIENTES: Paciente[] = [
  {
    id: 'pac1', nome: 'Miguel Oliveira', dataNascimento: '2019-03-15',
    diagnostico: 'TEA Nível 2 de suporte', nivelSuporte: 2,
    perfilSensorial: { hipersensitivo: ['auditivo', 'visual'], hipossensitivo: ['proprioceptivo'] },
    sistemaComunicacao: 'PECS',
    horariosCrise: ['14:00', '16:30'],
    humorHoje: '😊',
  },
  {
    id: 'pac2', nome: 'Sophia Santos', dataNascimento: '2020-07-22',
    diagnostico: 'TEA Nível 1 + TDAH', nivelSuporte: 1,
    perfilSensorial: { hipersensitivo: ['tátil'], hipossensitivo: ['vestibular', 'auditivo'] },
    sistemaComunicacao: 'verbal funcional',
    horariosCrise: ['11:00'],
    humorHoje: '⚡',
  },
  {
    id: 'pac3', nome: 'Arthur Lima', dataNascimento: '2018-11-08',
    diagnostico: 'TEA Nível 3 de suporte', nivelSuporte: 3,
    perfilSensorial: { hipersensitivo: ['auditivo', 'tátil', 'visual'], hipossensitivo: ['proprioceptivo'] },
    sistemaComunicacao: 'prancha de comunicação',
    horariosCrise: ['09:00', '14:00', '17:00'],
    humorHoje: '😴',
  },
];

export const SESSOES_HOJE: Sessao[] = [
  { id: 's1', pacienteId: 'pac1', profissionalId: 'p1', localId: 'l1', dataHora: '2026-05-15T09:00:00', duracaoMin: 45, status: 'concluida', objetivoDescricao: 'Comunicação funcional: usar PECS para pedir água', registro: { humor: '😊', notas: 'Usou PECS espontaneamente 3x' } },
  { id: 's2', pacienteId: 'pac1', profissionalId: 'p2', localId: 'l1', dataHora: '2026-05-15T10:30:00', duracaoMin: 50, status: 'concluida', objetivoDescricao: 'Regulação sensorial: tolerar texturas', registro: { humor: '😐', notas: 'Tolerou massinha por 8min (recorde!)' } },
  { id: 's3', pacienteId: 'pac2', profissionalId: 'p3', localId: 'l2', dataHora: '2026-05-15T11:00:00', duracaoMin: 40, status: 'em_andamento', objetivoDescricao: 'Articulação: sons /r/ e /s/' },
  { id: 's4', pacienteId: 'pac3', profissionalId: 'p4', localId: 'l1', dataHora: '2026-05-15T14:00:00', duracaoMin: 60, status: 'agendada', objetivoDescricao: 'Redução de autolesão: protocolo DRA' },
  { id: 's5', pacienteId: 'pac1', profissionalId: 'p3', localId: 'l2', dataHora: '2026-05-15T15:30:00', duracaoMin: 30, status: 'agendada', objetivoDescricao: 'Ampliação vocabulário PECS: frases de 2 símbolos' },
  { id: 's6', pacienteId: 'pac2', profissionalId: 'p1', localId: 'l3', dataHora: '2026-05-15T16:00:00', duracaoMin: 45, status: 'agendada', objetivoDescricao: 'Habilidades sociais: brincadeira cooperativa' },
];

export const PLANOS: PlanoTerapeutico[] = [
  {
    id: 'pt1', pacienteId: 'pac1', versao: 3,
    objetivos: [
      { id: 'o1', descricao: 'Comunicação funcional com PECS', profissionalLiderId: 'p3', meta: 'Usar PECS espontaneamente 10x/dia', baseline: 1, atual: 5, unidade: 'vezes/dia', status: 'em_andamento', estrategias: [
        { id: 'e1', profissionalId: 'p3', descricao: 'DTT com PECS nível 3-4: expansão de vocabulário' },
        { id: 'e2', profissionalId: 'p1', descricao: 'NET: oportunidades naturais de comunicação durante brincadeira' },
      ]},
      { id: 'o2', descricao: 'Redução de autolesão', profissionalLiderId: 'p1', meta: 'De 8x/dia para 2x/dia', baseline: 8, atual: 5, unidade: 'frequencia/dia', status: 'em_andamento', estrategias: [
        { id: 'e3', profissionalId: 'p1', descricao: 'DRA: reforçar comportamentos alternativos' },
        { id: 'e4', profissionalId: 'p2', descricao: 'Pausas sensoriais a cada 20min' },
      ]},
      { id: 'o3', descricao: 'Tolerância a texturas', profissionalLiderId: 'p2', meta: 'Tolerar massinha por 15min', baseline: 0, atual: 8, unidade: 'minutos', status: 'em_andamento', estrategias: [
        { id: 'e5', profissionalId: 'p2', descricao: 'Apresentação gradual: textura seca → úmida → massinha' },
      ]},
    ],
  },
];

export const DIARIO: DiarioBordo[] = [
  { id: 'd1', pacienteId: 'pac1', data: '2026-05-15', humor: '😊', sono: { horas: 9, qualidade: 'bom' }, alimentacao: 'normal', ocorrencias: [{ tipo: 'positivo', descricao: 'Pediu água com PECS sem prompt!' }], registradoPor: 'f1', registradoPorTipo: 'familia' },
  { id: 'd2', pacienteId: 'pac1', data: '2026-05-14', humor: '😐', sono: { horas: 7, qualidade: 'ruim' }, alimentacao: 'pouco', ocorrencias: [{ tipo: 'crise', descricao: 'Crise às 16h após mudança de rotina' }], registradoPor: 'f1', registradoPorTipo: 'familia' },
  { id: 'd3', pacienteId: 'pac1', data: '2026-05-13', humor: '😊', sono: { horas: 8, qualidade: 'bom' }, alimentacao: 'normal', ocorrencias: [], registradoPor: 'p1', registradoPorTipo: 'profissional' },
  { id: 'd4', pacienteId: 'pac2', data: '2026-05-15', humor: '⚡', sono: { horas: 6, qualidade: 'ruim' }, alimentacao: 'seletiva', ocorrencias: [{ tipo: 'observacao', descricao: 'Recusou frutas, aceitou apenas massa' }], registradoPor: 'f2', registradoPorTipo: 'familia' },
];

export const FEED: PostFeed[] = [
  { id: 'f1', pacienteId: 'pac1', autorNome: 'Dra. Marina Silva', autorTipo: 'profissional', conteudo: '🎉 Miguel usou PECS espontaneamente para pedir água durante a sessão! Primeira vez sem prompt. Momento histórico!', tipo: 'conquista', createdAt: '2026-05-15T09:45:00' },
  { id: 'f2', pacienteId: 'pac1', autorNome: 'Dr. Rafael Costa', autorTipo: 'profissional', conteudo: 'Miguel tolerou massinha por 8 minutos contínuos — recorde pessoal! Antes era 2 minutos. A estratégia de textura seca primeiro está funcionando.', tipo: 'registro', createdAt: '2026-05-15T11:20:00' },
  { id: 'f3', pacienteId: 'pac1', autorNome: 'Mãe do Miguel', autorTipo: 'familia', conteudo: 'Hoje ele dormiu 9h e acordou bem! Pediu o suco com o cartão do PECS no café da manhã. Estou emocionada 🥹', tipo: 'registro', createdAt: '2026-05-15T08:00:00' },
  { id: 'f4', pacienteId: 'pac2', autorNome: 'Ana Beatriz Souza', autorTipo: 'profissional', conteudo: 'Sophia produziu /r/ correto em 7/10 tentativas. Estamos progredindo bem com o PROMPT.', tipo: 'registro', createdAt: '2026-05-14T15:00:00' },
];

export const MENSAGENS: Mensagem[] = [
  { id: 'm1', canalId: 'c1', autorId: 'p3', autorNome: 'Ana Beatriz Souza', autorTipo: 'profissional', conteudo: 'Miguel ampliou vocabulário PECS: adicionamos "abrir" e "ajuda". Família, podem treinar em casa!', tipoMensagem: 'texto', createdAt: '2026-05-15T10:00:00' },
  { id: 'm2', canalId: 'c1', autorId: 'f1', autorNome: 'Mãe do Miguel', autorTipo: 'familia', conteudo: 'Ótimo! Ele já tentou usar "abrir" quando queria abrir a porta. Vamos praticar mais!', tipoMensagem: 'texto', createdAt: '2026-05-15T10:15:00' },
  { id: 'm3', canalId: 'c2', autorId: 'p2', autorNome: 'Dr. Rafael Costa', autorTipo: 'profissional', conteudo: '⚠️ Alerta: Miguel teve aumento de estereotipias motoras hoje. Sugiro reavaliar o protocolo sensorial na próxima supervisão.', tipoMensagem: 'insight', createdAt: '2026-05-15T11:30:00' },
  { id: 'm4', canalId: 'c2', autorId: 'p1', autorNome: 'Dra. Marina Silva', autorTipo: 'profissional', conteudo: 'Concordo. Vamos incluir mais pausas proprioceptivas. Posso ajustar o DRA para incluir atividades de carga?', tipoMensagem: 'texto', createdAt: '2026-05-15T11:45:00' },
];
