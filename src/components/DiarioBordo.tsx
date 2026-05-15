'use client';

import { DIARIO, PACIENTES } from '@/lib/mock-data';

interface Props {
  pacienteId: string;
}

export function DiarioBordo({ pacienteId }: Props) {
  const registros = DIARIO.filter(d => d.pacienteId === pacienteId).sort((a, b) => b.data.localeCompare(a.data));
  const paciente = PACIENTES.find(p => p.id === pacienteId);

  const humorEmoji: Record<string, string> = { '😊': 'Feliz', '😐': 'Neutro', '😢': 'Triste', '😡': 'Irritado', '😴': 'Cansado', '⚡': 'Agitado' };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📔 Diário de Bordo — {paciente?.nome}</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          ➕ Novo Registro
        </button>
      </div>

      {/* Input rápido */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-3">⚡ Registro Rápido</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Humor</label>
            <div className="flex gap-1">
              {['😊', '😐', '😢', '😡', '😴', '⚡'].map(e => (
                <button key={e} className="text-2xl hover:scale-125 transition-transform p-1">{e}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Sono (horas)</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="8" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Alimentação</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option>Normal</option>
              <option>Pouco</option>
              <option>Seletiva</option>
              <option>Recusou</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {registros.map(reg => (
        <div key={reg.id} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{reg.humor}</span>
              <div>
                <p className="font-bold">{new Date(reg.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                <p className="text-xs text-slate-400">
                  Registrado por: {reg.registradoPorTipo === 'familia' ? '👨‍👩‍👧 Família' : '👩‍⚕️ Profissional'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Sono: <strong>{reg.sono.horas}h</strong> ({reg.sono.qualidade})</p>
              <p className="text-sm text-slate-600">Alimentação: <strong>{reg.alimentacao}</strong></p>
            </div>
          </div>

          {reg.ocorrencias.length > 0 && (
            <div className="space-y-2">
              {reg.ocorrencias.map((oc, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${
                  oc.tipo === 'crise' ? 'bg-red-50 border border-red-200' :
                  oc.tipo === 'positivo' ? 'bg-emerald-50 border border-emerald-200' :
                  'bg-amber-50 border border-amber-200'
                }`}>
                  <span className="font-medium">
                    {oc.tipo === 'crise' ? '🚨' : oc.tipo === 'positivo' ? '🎉' : '📝'} {oc.tipo}
                  </span>
                  <p className="mt-1">{oc.descricao}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Correlação (feature inovadora) */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-5">
        <h3 className="font-bold text-indigo-800 mb-2">🤖 Correlação Automática</h3>
        <p className="text-sm text-indigo-600 mb-3">O sistema analisou os últimos 30 registros e encontrou:</p>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 border border-indigo-100">
            <span className="text-xs font-bold text-indigo-700">📊 Insight #1</span>
            <p className="text-sm mt-1">Sessões pós-almoço (14h-15h) têm <strong>80% mais engajamento</strong> quando o paciente dormiu 8h+</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-indigo-100">
            <span className="text-xs font-bold text-indigo-700">📊 Insight #2</span>
            <p className="text-sm mt-1">Dias com humor 😊 correlacionam com <strong>3x mais uso espontâneo de PECS</strong></p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-indigo-100">
            <span className="text-xs font-bold text-red-700">⚠️ Alerta</span>
            <p className="text-sm mt-1">Crises ocorrem com <strong>4x mais frequência</strong> em dias com sono &lt; 7h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
