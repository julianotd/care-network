'use client';

import { FEED, PACIENTES } from '@/lib/mock-data';

interface Props {
  pacienteId: string;
}

export function Feed({ pacienteId }: Props) {
  const posts = FEED.filter(p => p.pacienteId === pacienteId);
  const paciente = PACIENTES.find(p => p.id === pacienteId);

  const tipoIcon: Record<string, string> = {
    registro: '📝', video: '🎬', audio: '🎙️', conquista: '🎉', comportamento: '📊',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📱 Feed — {paciente?.nome}</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          ➕ Nova Publicação
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="text-slate-500 mt-3">Nenhuma publicação ainda</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tipoIcon[post.tipo]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{post.autorNome}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    post.autorTipo === 'profissional' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{post.autorTipo}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{post.conteudo}</p>

                {post.tipo === 'conquista' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-xs font-bold text-amber-700">🏆 Marco alcançado!</span>
                  </div>
                )}

                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
                  <button className="text-xs text-slate-500 hover:text-indigo-600">❤️ Curtir</button>
                  <button className="text-xs text-slate-500 hover:text-indigo-600">💬 Comentar</button>
                  <button className="text-xs text-slate-500 hover:text-indigo-600">📌 Salvar</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Tipos de post */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-3">➕ O que você pode postar</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🎬', label: 'Vídeo 15s', desc: 'Acerto na comunicação' },
            { icon: '🎙️', label: 'Áudio', desc: 'Nova palavra emitida' },
            { icon: '📝', label: 'Registro', desc: 'Nota da sessão' },
            { icon: '🎉', label: 'Conquista', desc: 'Marco atingido' },
          ].map(t => (
            <button key={t.label} className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center">
              <span className="text-2xl block mb-1">{t.icon}</span>
              <span className="text-xs font-medium block">{t.label}</span>
              <span className="text-xs text-slate-400 block">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
