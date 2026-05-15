'use client';

import { PACIENTES, SESSOES_HOJE, FEED, PROFISSIONAIS, LOCAIS } from '@/lib/mock-data';
import { calcularCompatibilidade } from '@/lib/types';

interface Props {
  onSelectPaciente: (id: string) => void;
}

export function Dashboard({ onSelectPaciente }: Props) {
  const agora = new Date();
  const sessaoAtual = SESSOES_HOJE.find(s => s.status === 'em_andamento');
  const proximas = SESSOES_HOJE.filter(s => s.status === 'agendada');
  const concluidas = SESSOES_HOJE.filter(s => s.status === 'concluida');

  return (
    <div className="space-y-6">
      {/* Topo: Resumo do dia */}
      <div className="grid grid-cols-4 gap-4">
        <Card icon="📅" label="Sessões hoje" value={SESSOES_HOJE.length} color="indigo" />
        <Card icon="✅" label="Concluídas" value={concluidas.length} color="emerald" />
        <Card icon="⏳" label="Restantes" value={proximas.length} color="amber" />
        <Card icon="🚨" label="Crises registradas" value={1} color="red" />
      </div>

      {/* Sessão em andamento */}
      {sessaoAtual && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="animate-pulse text-xl">🔴</span>
            <h3 className="font-bold text-amber-900">Sessão em Andamento</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {PACIENTES.find(p => p.id === sessaoAtual.pacienteId)?.nome}
              </p>
              <p className="text-sm text-amber-700">
                {PROFISSIONAIS.find(p => p.id === sessaoAtual.profissionalId)?.nome} · {LOCAIS.find(l => l.id === sessaoAtual.localId)?.nome}
              </p>
              <p className="text-sm text-amber-600 mt-1">🎯 {sessaoAtual.objetivoDescricao}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-amber-800">{new Date(sessaoAtual.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm text-amber-600">{sessaoAtual.duracaoMin} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Próximas sessões + Feed */}
      <div className="grid grid-cols-3 gap-6">
        {/* Próximas sessões */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4">📋 Próximas Sessões</h3>
          <div className="space-y-3">
            {proximas.map(s => {
              const paciente = PACIENTES.find(p => p.id === s.pacienteId);
              const prof = PROFISSIONAIS.find(p => p.id === s.profissionalId);
              const local = LOCAIS.find(l => l.id === s.localId);
              const compat = paciente && local ? calcularCompatibilidade(paciente, local) : 0;

              return (
                <div
                  key={s.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => paciente && onSelectPaciente(paciente.id)}
                >
                  <div className="text-lg">{paciente?.humorHoje}</div>
                  <div className="flex-1">
                    <p className="font-medium">{paciente?.nome}</p>
                    <p className="text-sm text-slate-500">{prof?.nome} · {local?.nome}</p>
                    <p className="text-xs text-indigo-600 mt-0.5">🎯 {s.objetivoDescricao}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-700">
                      {new Date(s.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-slate-400">{s.duracaoMin} min</p>
                  </div>
                  <CompatBadge score={compat} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Feed rápido */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4">📱 Feed Recente</h3>
          <div className="space-y-3">
            {FEED.slice(0, 4).map(post => (
              <div key={post.id} className="border-l-3 border-indigo-400 pl-3 py-1">
                <p className="text-xs text-slate-400">{post.autorNome} · {post.autorTipo}</p>
                <p className="text-sm mt-1 leading-relaxed">{post.conteudo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacientes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-4">👤 Pacientes Ativos</h3>
        <div className="grid grid-cols-3 gap-4">
          {PACIENTES.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectPaciente(p.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{p.humorHoje}</span>
                <div>
                  <p className="font-bold">{p.nome}</p>
                  <p className="text-xs text-slate-500">{p.diagnostico}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Nível {p.nivelSuporte}</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{p.sistemaComunicacao}</span>
                {p.perfilSensorial.hipersensitivo?.map(s => (
                  <span key={s} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🔊 {s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function CompatBadge({ score }: { score: number }) {
  if (score >= 3) return <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">✅ Alta compatibilidade</span>;
  if (score >= 0) return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">⚠️ Neutro</span>;
  return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">🔴 Conflito sensorial</span>;
}
