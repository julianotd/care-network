'use client';

import { Paciente, calcularCompatibilidade } from '@/lib/types';
import { SESSOES_HOJE, LOCAIS, PROFISSIONAIS, PLANOS } from '@/lib/mock-data';

interface Props {
  paciente: Paciente;
}

export function PacienteView({ paciente }: Props) {
  const plano = PLANOS.find(p => p.pacienteId === paciente.id);
  const sessoesPaciente = SESSOES_HOJE.filter(s => s.pacienteId === paciente.id);
  const sensibilidades = [
    ...(paciente.perfilSensorial.hipersensitivo?.map(s => ({ tipo: s, nivel: 'hiper' })) || []),
    ...(paciente.perfilSensorial.hipossensitivo?.map(s => ({ tipo: s, nivel: 'hipo' })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header do paciente */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-5">
          <span className="text-6xl">{paciente.humorHoje}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{paciente.nome}</h2>
            <p className="text-slate-500">{paciente.diagnostico} · Nível {paciente.nivelSuporte} de suporte</p>
            <p className="text-sm text-slate-400 mt-1">Nascimento: {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')} · Comunicação: {paciente.sistemaComunicacao}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">✏️ Editar</button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">📄 Relatório</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Perfil Sensorial */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">🧠 Perfil Sensorial</h3>
          <div className="space-y-3">
            {sensibilidades.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  s.nivel === 'hiper' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {s.nivel === 'hiper' ? '🔴 HIPER' : '🔵 HIPO'}
                </span>
                <span className="text-sm">{s.tipo}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">📍 Locais Compatíveis</h4>
            {LOCAIS.map(local => {
              const score = calcularCompatibilidade(paciente, local);
              return (
                <div key={local.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm">{local.nome}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    score >= 3 ? 'bg-emerald-100 text-emerald-700' :
                    score >= 0 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {score >= 3 ? '✅' : score >= 0 ? '⚠️' : '🔴'} {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sessões do dia */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📅 Sessões de Hoje</h3>
          <div className="space-y-3">
            {sessoesPaciente.map(s => {
              const prof = PROFISSIONAIS.find(p => p.id === s.profissionalId);
              const local = LOCAIS.find(l => l.id === s.localId);
              const statusIcon: Record<string, string> = {
                agendada: '⏳', em_andamento: '🔴', concluida: '✅', cancelada: '❌',
              };
              return (
                <div key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{prof?.nome}</span>
                    <span>{statusIcon[s.status]}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {local?.nome} · {s.duracaoMin}min
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">🎯 {s.objetivoDescricao}</p>
                  {s.registro && (
                    <div className="mt-2 p-2 bg-white rounded border border-slate-100">
                      <span>{s.registro.humor}</span>
                      <span className="text-xs text-slate-500 ml-2">{s.registro.notas}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Horários de crise */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-red-600 mb-2">⚠️ Horários de Pico de Crise</h4>
            <div className="flex gap-2">
              {paciente.horariosCrise.map(h => (
                <span key={h} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-mono">{h}</span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Evitar agendar terapias intensivas nesses horários</p>
          </div>
        </div>

        {/* Resumo do Plano */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold mb-4">📋 Plano Terapêutico (v{plano?.versao})</h3>
          {plano?.objetivos.map(obj => {
            const progresso = obj.baseline > 0 ? Math.round(((obj.baseline - obj.atual) / (obj.baseline - 2)) * 100) : 0;
            const lider = PROFISSIONAIS.find(p => p.id === obj.profissionalLiderId);

            return (
              <div key={obj.id} className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{obj.descricao}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    obj.status === 'atingido' ? 'bg-emerald-100 text-emerald-700' :
                    obj.status === 'em_andamento' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>{obj.status}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">👤 Líder: {lider?.nome}</p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-slate-400">Baseline: {obj.baseline}</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, progresso))}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{obj.atual}</span>
                  <span className="text-xs text-slate-400">→ {obj.meta}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {obj.estrategias.length} estratégia(s) ativa(s)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
