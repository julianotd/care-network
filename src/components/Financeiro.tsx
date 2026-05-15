'use client';

import { PACIENTES, PROFISSIONAIS, SESSOES_HOJE, LOCAIS } from '@/lib/mock-data';

export function Financeiro() {
  const tarifas = {
    clinica: { valor: 180, label: 'Clínica' },
    domicilio: { valor: 250, label: 'Domiciliar' },
    teleatendimento: { valor: 120, label: 'Teleatendimento' },
    escola: { valor: 200, label: 'Escola' },
  };

  const sessoesFaturadas = SESSOES_HOJE.filter(s => s.status === 'concluida').map(s => {
    const prof = PROFISSIONAIS.find(p => p.id === s.profissionalId);
    const local = LOCAIS.find(l => l.id === s.localId);
    const tarifa = tarifas[local?.tipo as keyof typeof tarifas] || tarifas.clinica;
    return {
      ...s,
      profissional: prof?.nome,
      local: local?.nome,
      tipo: local?.tipo,
      valor: tarifa.valor,
    };
  });

  const totalDia = sessoesFaturadas.reduce((acc, s) => acc + s.valor, 0);
  const totalMes = totalDia * 22; // estimativa

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">💰 Financeiro</h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-600">Faturamento Hoje</p>
          <p className="text-2xl font-bold text-emerald-700">R$ {totalDia}</p>
          <p className="text-xs text-emerald-500">{sessoesFaturadas.length} sessões</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-xs text-indigo-600">Projeção Mensal</p>
          <p className="text-2xl font-bold text-indigo-700">R$ {totalMes.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-indigo-500">22 dias úteis</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600">Pendências</p>
          <p className="text-2xl font-bold text-amber-700">3</p>
          <p className="text-xs text-amber-500">R$ 540 em aberto</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-600">Ticket Médio</p>
          <p className="text-2xl font-bold text-slate-700">R$ {sessoesFaturadas.length > 0 ? Math.round(totalDia / sessoesFaturadas.length) : 0}</p>
          <p className="text-xs text-slate-500">por sessão</p>
        </div>
      </div>

      {/* Tabela de tarifas */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-4">📋 Tabela de Tarifas por Tipo de Atendimento</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(tarifas).map(([key, t]) => (
            <div key={key} className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
              <p className="text-sm font-medium text-slate-500">{t.label}</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">R$ {t.valor}</p>
              <p className="text-xs text-slate-400">por sessão</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sessões do dia */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-4">📅 Sessões Faturadas Hoje</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-2 text-slate-500 font-medium">Horário</th>
              <th className="text-left p-2 text-slate-500 font-medium">Paciente</th>
              <th className="text-left p-2 text-slate-500 font-medium">Profissional</th>
              <th className="text-left p-2 text-slate-500 font-medium">Local</th>
              <th className="text-left p-2 text-slate-500 font-medium">Tipo</th>
              <th className="text-right p-2 text-slate-500 font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {sessoesFaturadas.map(s => {
              const paciente = PACIENTES.find(p => p.id === s.pacienteId);
              return (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 font-mono">{new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-2 font-medium">{paciente?.nome}</td>
                  <td className="p-2">{s.profissional}</td>
                  <td className="p-2">{s.local}</td>
                  <td className="p-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{s.tipo}</span>
                  </td>
                  <td className="p-2 text-right font-bold text-emerald-600">R$ {s.valor}</td>
                </tr>
              );
            })}
            <tr className="font-bold">
              <td colSpan={5} className="p-2 text-right">Total:</td>
              <td className="p-2 text-right text-emerald-700">R$ {totalDia}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Diferenciação por profissional */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-4">👤 Tarifas por Profissional</h3>
        <div className="space-y-3">
          {PROFISSIONAIS.map(prof => {
            const multiplicador = prof.especialidades.includes('ABA') ? 1.2 : prof.especialidades.includes('Fonoaudiologia') ? 1.1 : 1.0;
            const valorBase = 180;
            const valor = Math.round(valorBase * multiplicador);
            return (
              <div key={prof.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{prof.nome}</p>
                  <p className="text-xs text-slate-500">{prof.especialidades.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">R$ {valor}</p>
                  <p className="text-xs text-slate-400">×{multiplicador} multiplicador</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
