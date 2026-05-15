// Notification helpers — funções reutilizáveis para disparar notificações

export interface NotifyOptions {
  userIds: string[];
  title: string;
  body: string;
  url?: string;
  tipo?: 'geral' | 'crise' | 'conquista' | 'tarefa' | 'insight';
  pacienteId?: string;
}

/**
 * Envia notificação push para os usuários especificados
 */
export async function notify(options: NotifyOptions): Promise<any> {
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    return await res.json();
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return { error: 'Falha ao enviar' };
  }
}

/**
 * Notifica todos os profissionais de um paciente sobre uma crise
 */
export async function notifyCrisis(pacienteId: string, pacienteNome: string): Promise<any> {
  // Em produção: buscar profissionais do círculo de cuidado no Supabase
  // const { data } = await supabase.from('circulo_cuidado')
  //   .select('profissional_id')
  //   .eq('paciente_id', pacienteId);
  // const userIds = data.map(c => c.profissional_id);

  const userIds = ['user-prof-1', 'user-prof-2', 'user-coord-1'];

  return notify({
    userIds,
    title: `🚨 CRISE — ${pacienteNome}`,
    body: `Emergência comportacional registrada. Toque para ver o protocolo de crise e atender.`,
    url: `/crise/${pacienteId}`,
    tipo: 'crise',
    pacienteId,
  });
}

/**
 * Notifica sobre uma nova conquista no feed
 */
export async function notifyConquista(
  pacienteId: string,
  pacienteNome: string,
  descricao: string,
  profissionalNome: string
): Promise<any> {
  // Notifica família e coordenação
  const userIds = ['user-familia-1', 'user-coord-1'];

  return notify({
    userIds,
    title: `🎉 Nova conquista — ${pacienteNome}`,
    body: `${profissionalNome}: ${descricao}`,
    url: `/feed/${pacienteId}`,
    tipo: 'conquista',
    pacienteId,
  });
}

/**
 * Notifica profissional sobre uma nova tarefa atribuída
 */
export async function notifyTarefa(
  userId: string,
  descricao: string,
  pacienteNome: string
): Promise<any> {
  return notify({
    userIds: [userId],
    title: `📋 Nova tarefa atribuída`,
    body: `${descricao} — Paciente: ${pacienteNome}`,
    url: `/plano`,
    tipo: 'tarefa',
  });
}

/**
 * Notifica sobre um insight automático do sistema
 */
export async function notifyInsight(
  userIds: string[],
  insight: string,
  pacienteNome: string
): Promise<any> {
  return notify({
    userIds,
    title: `⚡ Insight automático — ${pacienteNome}`,
    body: insight,
    url: `/diario`,
    tipo: 'insight',
  });
}
