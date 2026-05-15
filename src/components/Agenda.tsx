'use client';

import { SESSOES_HOJE, PACIENTES, PROFISSIONAIS, LOCAIS } from '@/lib/mock-data';
import { calcularCompatibilidade } from '@/lib/types';

export function Agenda() {
  const horas = Array.from({ length: 12 }, (_, i) => i + 8); // 8h às 19h

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📅 Agenda — 15 de Maio, 2026</h2>
        <div className="flex gap-2">
          <FilterBtn label="Todos" active />
          <FilterBtn label="Miguel" />
          <FilterBtn label="Sophia" />
          <FilterBtn label="Arthur" />
        </div>
      </div>

      {/* Legenda sensorial */}
      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> Alta compatibilidade</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400 inline-block" /> Neutro</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Conflito sensorial</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-400 inline-block" /> Em andamento</span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {horas.map(hora => {
          const sessoesHora = SESSOES_HOJE.filter(s => new Date(s.dataHora).getHours() === hora);

          return (
            <div key={hora} className="flex border-b border-slate-100 last:border-0 min-h-[72px]">
              <div className="w-20 flex-shrink-0 p-3 text-right text-sm font-mono text-slate-400 border-r border-slate-100">
                {hora.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 p-2 flex gap-2 flex-wrap">
                {sessoesHora.length === 0 ? (
                  <span className="text-xs text-slate-300 self-center">—</span>
                ) : (
                  sessoesHora.map(s => {
                    const paciente = PACIENTES.find(p => p.id === s.pacienteId);
                    const prof = PROFISSIONAIS.find(p => p.id === s.profissionalId);
                    const local = LOCAIS.find(l => l.id === s.localId);
                    const compat = paciente && local ? calcularCompatibilidade(paciente, local) : 0;

                    const statusColors: Record<string, string> = {
                      agendada: 'border-l-slate-400 bg-slate-50',
                      em_andamento: 'border-l-indigo-500 bg-indigo-50 ring-2 ring-indigo-200',
                      concluida: 'border-l-emerald-500 bg-emerald-50',
                      cancelada: 'border-l-red-400 bg-red-50 opacity-60',
                    };

                    return (
                      <div
                        key={s.id}
                        className={`flex-1 min-w-[280px] rounded-lg border-l-4 p-3 ${statusColors[s.status]} transition-all hover:shadow-md cursor-pointer`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{paciente?.nome}</span>
                          <CompatIndicator score={compat} />
                        </div>
                        <p className="text-xs text-slate-600">{prof?.nome}</p>
                        <p className="text-xs text-slate-500 mt-1">📍 {local?.nome} · {s.duracaoMin}min</p>
                        <p className="text-xs text-indigo-600 mt-1 truncate">🎯 {s.objetivoDescricao}</p>
                        {s.registro && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <span className="text-sm">{s.registro.humor}</span>
                            <span className="text-xs text-slate-500 ml-2">{s.registro.notas}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mapa de calor sensorial */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-3">🌡️ Mapa de Calor — Tolerância por Horário</h3>
        <p className="text-sm text-slate-500 mb-4">Baseado no histórico de crises e engajamento do paciente selecionado</p>
        <div className="flex gap-1">
          {Array.from({ length: 12 }, (_, i) => {
            const h = i + 8;
            const crise = PACIENTES[0].horariosCrise.some(ch => parseInt(ch) === h);
            const nivel = crise ? 'bg-red-400' : h >= 9 && h <= 11 ? 'bg-emerald-400' : h >= 14 && h <= 15 ? 'bg-amber-400' : 'bg-slate-200';
            return (
              <div key={h} className="flex-1 text-center">
                <div className={`h-12 rounded ${nivel} flex items-center justify-center text-xs font-bold text-white`}>
                  {crise ? '⚠️' : nivel.includes('emerald') ? '😊' : nivel.includes('amber') ? '😐' : ''}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">{h}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterBtn({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={`text-xs px-3 py-1.5 rounded-full transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
      {label}
    </button>
  );
}

function CompatIndicator({ score }: { score: number }) {
  if (score >= 3) return <span className="w-3 h-3 rounded-full bg-emerald-400" title="Alta compatibilidade" />;
  if (score >= 0) return <span className="w-3 h-3 rounded-full bg-amber-400" title="Neutro" />;
  return <span className="w-3 h-3 rounded-full bg-red-400" title="Conflito sensorial" />;
}
