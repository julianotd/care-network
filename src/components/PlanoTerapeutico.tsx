'use client';

import { PLANOS, PROFISSIONAIS, PACIENTES } from '@/lib/mock-data';

interface Props {
  pacienteId: string;
}

export function PlanoTerapeuticoView({ pacienteId }: Props) {
  const plano = PLANOS.find(p => p.pacienteId === pacienteId);
  const paciente = PACIENTES.find(p => p.id === pacienteId);

  if (!plano) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl">📋</span>
        <p className="text-slate-500 mt-3">Nenhum plano terapêutico encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">📋 Plano Terapêutico Integrado (PTI)</h2>
          <p className="text-sm text-slate-500">{paciente?.nome} · Versão {plano.versao} · Status: Ativo</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">📄 Exportar PDF</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">✏️ Editar Plano</button>
        </div>
      </div>

      {/* Visão geral */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-indigo-700">{plano.objetivos.length}</p>
          <p className="text-sm text-indigo-600">Objetivos ativos</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{plano.objetivos.filter(o => o.status === 'atingido').length}</p>
          <p className="text-sm text-emerald-600">Objetivos atingidos</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-amber-700">{plano.objetivos.reduce((acc, o) => acc + o.estrategias.length, 0)}</p>
          <p className="text-sm text-amber-600">Estratégias ativas</p>
        </div>
      </div>

      {/* Objetivos detalhados */}
      {plano.objetivos.map((obj, idx) => {
        const lider = PROFISSIONAIS.find(p => p.id === obj.profissionalLiderId);
        const progresso = obj.baseline > 0 ? Math.round(((obj.baseline - obj.atual) / (obj.baseline - 2)) * 100) : 0;

        return (
          <div key={obj.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header do objetivo */}
            <div className={`p-5 ${
              obj.status === 'atingido' ? 'bg-emerald-50 border-b border-emerald-200' :
              obj.status === 'em_andamento' ? 'bg-indigo-50 border-b border-indigo-200' :
              'bg-slate-50 border-b border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-300">#{idx + 1}</span>
                  <div>
                    <h3 className="font-bold text-lg">{obj.descricao}</h3>
                    <p className="text-sm text-slate-500">👤 Líder: {lider?.nome} · {lider?.especialidades.join(', ')}</p>
                  </div>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  obj.status === 'atingido' ? 'bg-emerald-200 text-emerald-800' :
                  obj.status === 'em_andamento' ? 'bg-indigo-200 text-indigo-800' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {obj.status === 'atingido' ? '✅ Atingido' : obj.status === 'em_andamento' ? '🔄 Em andamento' : '⏸️ Suspenso'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Meta e progresso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Meta: {obj.meta}</span>
                  <span className="text-sm font-mono text-slate-400">{obj.unidade}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500 w-20">Baseline: {obj.baseline}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progresso >= 80 ? 'bg-emerald-500' : progresso >= 40 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, progresso))}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                      {progresso}%
                    </span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 w-20 text-right">Atual: {obj.atual}</span>
                </div>
              </div>

              {/* Estratégias */}
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-2">🎯 Estratégias</h4>
                <div className="space-y-2">
                  {obj.estrategias.map(est => {
                    const prof = PROFISSIONAIS.find(p => p.id === est.profissionalId);
                    return (
                      <div key={est.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {prof?.nome.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-sm">{est.descricao}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{prof?.nome}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Colaboração */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-5">
        <h3 className="font-bold text-emerald-800 mb-2">🤝 Colaboração em Tempo Real</h3>
        <p className="text-sm text-emerald-600 mb-3">Todos os profissionais podem editar este plano. Mudanças são versionadas e notificadas.</p>
        <div className="flex gap-3">
          {PROFISSIONAIS.filter(p => plano.objetivos.some(o => o.profissionalLiderId === p.id || o.estrategias.some(e => e.profissionalId === p.id))).map(prof => (
            <div key={prof.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-emerald-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                {prof.nome.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <span className="text-xs font-medium">{prof.nome}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
