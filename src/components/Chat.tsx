'use client';

import { useState } from 'react';
import { MENSAGENS } from '@/lib/mock-data';

interface Props {
  pacienteId: string;
}

type Canal = 'comunicacao' | 'sensorial' | 'rotina';

export function Chat({ pacienteId }: Props) {
  const [canalAtivo, setCanalAtivo] = useState<Canal>('comunicacao');
  const [novaMsg, setNovaMsg] = useState('');

  const canais: { key: Canal; nome: string; icon: string; descricao: string; participantes: string }[] = [
    { key: 'comunicacao', nome: 'Comunicação', icon: '🗣️', descricao: 'Fono / ABA / PECS', participantes: 'Fono + Terapeuta + Família' },
    { key: 'sensorial', nome: 'Sensorial', icon: '🧠', descricao: 'TO / Psicologia', participantes: 'TO + Psicólogo + Família' },
    { key: 'rotina', nome: 'Rotina', icon: '📋', descricao: 'Geral + Escola', participantes: 'Todos + Escola' },
  ];

  const mensagens = MENSAGENS.filter(m => {
    const canalMap: Record<string, string> = { comunicacao: 'c1', sensorial: 'c2', rotina: 'c3' };
    return m.canalId === canalMap[canalAtivo];
  });

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* Sidebar de canais */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <h2 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">💬 Canais Terapêuticos</h2>
        {canais.map(c => (
          <button
            key={c.key}
            onClick={() => setCanalAtivo(c.key)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              canalAtivo === c.key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white border border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{c.icon}</span>
              <div>
                <p className="font-medium text-sm">{c.nome}</p>
                <p className={`text-xs ${canalAtivo === c.key ? 'text-indigo-200' : 'text-slate-400'}`}>{c.descricao}</p>
              </div>
            </div>
            <p className={`text-xs mt-1 ${canalAtivo === c.key ? 'text-indigo-200' : 'text-slate-400'}`}>
              👥 {c.participantes}
            </p>
          </button>
        ))}

        {/* Regra de automação */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-bold text-amber-700">⚡ Automação</p>
          <p className="text-xs text-amber-600 mt-1">Mensagens podem gerar tarefas automaticamente quando marcadas como "insight"</p>
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold">{canais.find(c => c.key === canalAtivo)?.icon} {canais.find(c => c.key === canalAtivo)?.nome}</h3>
          <p className="text-xs text-slate-400">{canais.find(c => c.key === canalAtivo)?.participantes}</p>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensagens.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl">💬</span>
              <p className="text-slate-400 mt-2">Nenhuma mensagem neste canal ainda</p>
            </div>
          ) : (
            mensagens.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.autorTipo === 'familia' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  msg.autorTipo === 'profissional' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {msg.autorNome.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div className={`max-w-[70%] ${msg.autorTipo === 'familia' ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.autorNome}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.tipoMensagem === 'insight' && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">⚡ Insight</span>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.tipoMensagem === 'insight'
                      ? 'bg-amber-50 border border-amber-200'
                      : msg.autorTipo === 'familia'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-slate-50 border border-slate-200'
                  }`}>
                    {msg.conteudo}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={novaMsg}
            onChange={(e) => setNovaMsg(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>💬 Texto</option>
            <option>⚡ Insight (gera tarefa)</option>
            <option>🎬 Vídeo</option>
            <option>🎙️ Áudio</option>
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Enviar</button>
        </div>
      </div>
    </div>
  );
}
