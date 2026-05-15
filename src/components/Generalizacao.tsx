'use client';

import { useState } from 'react';
import { PACIENTES, PLANOS, PROFISSIONAIS } from '@/lib/mock-data';

interface Props {
  pacienteId: string;
}

interface Item {
  id: string;
  objetivoId: string;
  descricao: string;
  concluido: boolean;
  data?: string;
}

export function Generalizacao({ pacienteId }: Props) {
  const paciente = PACIENTES.find(p => p.id === pacienteId);
  const plano = PLANOS.find(p => p.pacienteId === pacienteId);

  const [itens, setItens] = useState<Item[]>([
    { id: 'g1', objetivoId: 'o1', descricao: 'Usou PECS para pedir água em casa', concluido: true, data: '2026-05-15' },
    { id: 'g2', objetivoId: 'o1', descricao: 'Usou PECS para pedir lanche na escola', concluido: false },
    { id: 'g3', objetivoId: 'o1', descricao: 'Formou frase de 2 símbolos ("quero água")', concluido: true, data: '2026-05-14' },
    { id: 'g4', objetivoId: 'o2', descricao: 'Conseguiu escovar dentes sem crise', concluido: false },
    { id: 'g5', objetivoId: 'o2', descricao: 'Tolerou cabelo sendo penteado', concluido: true, data: '2026-05-13' },
    { id: 'g6', objetivoId: 'o3', descricao: 'Brincou com massinha por 5+ minutos', concluido: false },
    { id: 'g7', objetivoId: 'o3', descricao: 'Comeu fruta com textura diferente', concluido: false },
  ]);

  const toggle = (id: string) => {
    setItens(prev => prev.map(item =>
      item.id === id ? { ...item, concluido: !item.concluido, data: !item.concluido ? new Date().toISOString().split('T')[0] : undefined } : item
    ));
  };

  const taxaConclusao = Math.round((itens.filter(i => i.concluido).length / itens.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">✅ Checklist de Generalização</h2>
          <p className="text-sm text-slate-500">{paciente?.nome} — O que funciona na terapia, funciona em casa?</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-indigo-600">{taxaConclusao}%</p>
          <p className="text-xs text-slate-400">taxa de generalização</p>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progresso Geral</span>
          <span className="text-sm text-slate-500">{itens.filter(i => i.concluido).length} de {itens.length} itens</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${taxaConclusao >= 70 ? 'bg-emerald-500' : taxaConclusao >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${taxaConclusao}%` }}
          />
        </div>
      </div>

      {/* Itens por objetivo */}
      {plano?.objetivos.map(obj => {
        const itensObj = itens.filter(i => i.objetivoId === obj.id);
        const lider = PROFISSIONAIS.find(p => p.id === obj.profissionalLiderId);

        return (
          <div key={obj.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{obj.descricao}</h3>
                  <p className="text-xs text-slate-500">👤 {lider?.nome} · Meta: {obj.meta}</p>
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {itensObj.filter(i => i.concluido).length}/{itensObj.length}
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {itensObj.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => toggle(item.id)}
                >
                  <button
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                      item.concluido
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {item.concluido && '✓'}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm ${item.concluido ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.descricao}
                    </p>
                    {item.data && (
                      <p className="text-xs text-emerald-600 mt-0.5">✅ Concluído em {new Date(item.data).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <span className="text-lg">{item.concluido ? '🎉' : '⏳'}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Notificação para o profissional */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-5">
        <h3 className="font-bold text-emerald-800 mb-2">🔔 Notificação Automática</h3>
        <p className="text-sm text-emerald-600">
          Quando a família marca um item como concluído, o profissional responsável é notificado automaticamente.
          Isso permite ajustar o plano terapêutico em tempo real.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            📱 Notificação push
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            💬 Mensagem no chat
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            📊 Atualização do gráfico
          </span>
        </div>
      </div>
    </div>
  );
}
