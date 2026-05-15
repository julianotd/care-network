'use client';

import { useState } from 'react';
import { PACIENTES, PROFISSIONAIS, SESSOES_HOJE, LOCAIS } from '@/lib/mock-data';

export function Substituicao() {
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);

  const sessoes = SESSOES_HOJE.map(s => {
    const paciente = PACIENTES.find(p => p.id === s.pacienteId);
    const prof = PROFISSIONAIS.find(p => p.id === s.profissionalId);
    const local = LOCAIS.find(l => l.id === s.localId);
    return { ...s, paciente, profissional: prof, local };
  });

  const sugerirSubstituto = (sessaoId: string) => {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (!sessao) return [];

    return PROFISSIONAIS.filter(p => p.id !== sessao.profissionalId).map(p => {
      let score = 0;
      const metodosComuns = p.metodos.filter(m => sessao.profissional?.metodos.includes(m));
      score += metodosComuns.length * 3;

      const especialidadesComuns = p.especialidades.filter(e => sessao.profissional?.especialidades.includes(e));
      score += especialidadesComuns.length * 2;

      const jaConhece = sessao.paciente && Math.random() > 0.5;
      if (jaConhece) score += 5;

      return { ...p, score, metodosComuns, especialidadesComuns, jaConhece };
    }).sort((a, b) => b.score - a.score);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">🔄 Substituição Consciente de Profissional</h2>
      <p className="text-sm text-slate-500">Quando um profissional falta, o sistema sugere substitutos com base no histórico e métodos compatíveis.</p>

      {/* Sessões do dia */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-4">📅 Sessões de Hoje</h3>
        <div className="space-y-3">
          {sessoes.map(s => (
            <div
              key={s.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                sessaoSelecionada === s.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSessaoSelecionada(s.id === sessaoSelecionada ? null : s.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.paciente?.humorHoje}</span>
                  <div>
                    <p className="font-medium">{s.paciente?.nome}</p>
                    <p className="text-xs text-slate-500">{s.profissional?.nome} · {s.local?.nome}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' :
                    s.status === 'em_andamento' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{s.status}</span>
                </div>
              </div>

              {/* Sugestões de substituição */}
              {sessaoSelecionada === s.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-indigo-700 mb-3">🎯 Sugestões de Substituição</h4>
                  <div className="space-y-2">
                    {sugerirSubstituto(s.id).map((sub, i) => (
                      <div key={sub.id} className={`flex items-center gap-4 p-3 rounded-lg ${
                        i === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {i + 0}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{sub.nome}</p>
                          <p className="text-xs text-slate-500">{sub.especialidades.join(', ')}</p>
                          <div className="flex gap-1 mt-1">
                            {sub.metodosComuns.map(m => (
                              <span key={m} className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{m}</span>
                            ))}
                            {sub.jaConhece && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Já conhece o paciente</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{sub.score}</p>
                          <p className="text-xs text-slate-400">compatibilidade</p>
                        </div>
                        {i === 0 && (
                          <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700">
                            ✅ Substituir
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Critérios */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-3">📊 Critérios de Matching</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '🎯', label: 'Métodos compatíveis', peso: '×3', desc: 'DTT, NET, PECS, TEACCH...' },
            { icon: '🧠', label: 'Especialidades', peso: '×2', desc: 'ABA, TO, Fono, Psicologia' },
            { icon: '👋', label: 'Já conhece o paciente', peso: '×5', desc: 'Histórico de interações' },
          ].map(c => (
            <div key={c.label} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{c.icon}</span>
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded ml-auto">{c.peso}</span>
              </div>
              <p className="text-xs text-slate-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
