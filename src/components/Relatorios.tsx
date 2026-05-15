'use client';

import { useState } from 'react';
import { PACIENTES, PROFISSIONAIS, LOCAIS, SESSOES_HOJE, PLANOS, DIARIO } from '@/lib/mock-data';

export function Relatorios() {
  const [pacienteSel, setPacienteSel] = useState(PACIENTES[0].id);
  const [tipoRelatorio, setTipoRelatorio] = useState<'escola' | 'plano_saude' | 'laudo' | 'familia'>('familia');

  const paciente = PACIENTES.find(p => p.id === pacienteSel)!;
  const plano = PLANOS.find(p => p.pacienteId === pacienteSel);
  const sessoes = SESSOES_HOJE.filter(s => s.pacienteId === pacienteSel);
  const diarios = DIARIO.filter(d => d.pacienteId === pacienteSel);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">📄 Relatórios Automáticos</h2>

      {/* Configuração */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Paciente</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            value={pacienteSel}
            onChange={e => setPacienteSel(e.target.value)}
          >
            {PACIENTES.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-500 block mb-1">Tipo de Relatório</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            value={tipoRelatorio}
            onChange={e => setTipoRelatorio(e.target.value as any)}
          >
            <option value="familia">👨‍👩‍👧 Para a Família</option>
            <option value="escola">🏫 Para a Escola</option>
            <option value="plano_saude">🏥 Para o Plano de Saúde</option>
            <option value="laudo">📋 Laudo Pericial</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            📥 Gerar PDF
          </button>
        </div>
      </div>

      {/* Preview do relatório */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-800">Relatório de Evolução Terapêutica</h1>
          <p className="text-slate-500 mt-1">
            {tipoRelatorio === 'familia' ? 'Relatório para Família' :
             tipoRelatorio === 'escola' ? 'Relatório Escolar' :
             tipoRelatorio === 'plano_saude' ? 'Relatório para Plano de Saúde' :
             'Laudo Pericial'}
          </p>
          <p className="text-sm text-slate-400">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Dados do paciente */}
        <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-500">Nome</p>
            <p className="font-medium">{paciente.nome}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Nascimento</p>
            <p className="font-medium">{new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Diagnóstico</p>
            <p className="font-medium">{paciente.diagnostico}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Nível de Suporte</p>
            <p className="font-medium">Nível {paciente.nivelSuporte}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Sistema de Comunicação</p>
            <p className="font-medium">{paciente.sistemaComunicacao}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Profissionais Envolvidos</p>
            <p className="font-medium">{PROFISSIONAIS.length} profissionais</p>
          </div>
        </div>

        {/* Objetivos e progresso */}
        {plano && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">📊 Objetivos Terapêuticos e Progresso</h3>
            {plano.objetivos.map((obj, idx) => {
              const progresso = obj.baseline > 0 ? Math.round(((obj.baseline - obj.atual) / (obj.baseline - 2)) * 100) : 0;
              const lider = PROFISSIONAIS.find(p => p.id === obj.profissionalLiderId);

              return (
                <div key={obj.id} className="mb-4 p-4 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Objetivo {idx + 1}</span>
                      <h4 className="font-semibold mt-1">{obj.descricao}</h4>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      obj.status === 'atingido' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{obj.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Responsável: {lider?.nome}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-20">Baseline: {obj.baseline}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, Math.max(5, progresso))}%` }} />
                    </div>
                    <span className="text-xs font-bold text-indigo-600 w-16 text-right">{obj.atual} / {obj.baseline}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Meta: {obj.meta}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Gráfico de evolução (simplificado) */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">📈 Evolução — Últimos 30 Dias</h3>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }, (_, i) => {
              const val = Math.floor(Math.random() * 10);
              const color = val > 7 ? 'bg-emerald-400' : val > 4 ? 'bg-amber-400' : val > 0 ? 'bg-red-400' : 'bg-slate-100';
              return (
                <div key={i} className="group relative">
                  <div className={`h-8 rounded ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-xs text-slate-400 text-center block mt-0.5">{i + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded inline-block" /> Alto engajamento</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded inline-block" /> Moderado</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded inline-block" /> Baixo / Crise</span>
          </div>
        </div>

        {/* Dados do diário */}
        <div>
          <h3 className="text-lg font-bold mb-4">📔 Resumo do Diário de Bordo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2 text-slate-500 font-medium">Data</th>
                  <th className="text-left p-2 text-slate-500 font-medium">Humor</th>
                  <th className="text-left p-2 text-slate-500 font-medium">Sono</th>
                  <th className="text-left p-2 text-slate-500 font-medium">Alimentação</th>
                  <th className="text-left p-2 text-slate-500 font-medium">Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {diarios.map(d => (
                  <tr key={d.id} className="border-b border-slate-100">
                    <td className="p-2">{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                    <td className="p-2 text-xl">{d.humor}</td>
                    <td className="p-2">{d.sono.horas}h ({d.sono.qualidade})</td>
                    <td className="p-2">{d.alimentacao}</td>
                    <td className="p-2">
                      {d.ocorrencias.map((o, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full mr-1 ${
                          o.tipo === 'crise' ? 'bg-red-100 text-red-700' :
                          o.tipo === 'positivo' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{o.tipo}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-400">
          <span>Care Network — Ecossistema de Cuidado em Rede</span>
          <span>Documento gerado automaticamente · {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}
