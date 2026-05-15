'use client';

import { useState } from 'react';
import { PACIENTES, PROFISSIONAIS } from '@/lib/mock-data';
import { useNotifications } from '@/lib/notifications';

interface Props {
  pacienteId: string;
}

export function Crise({ pacienteId }: Props) {
  const paciente = PACIENTES.find(p => p.id === pacienteId);
  const { sendCrisisAlert, isSubscribed, subscribe } = useNotifications();
  const [ativado, setAtivado] = useState(false);
  const [protocolo, setProtocolo] = useState(false);
  const [notificacaoEnviada, setNotificacaoEnviada] = useState(false);

  const profissionaisProximos = PROFISSIONAIS.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-red-700">🚨 Protocolo de Crise — {paciente?.nome}</h2>

      {/* Botão de crise */}
      <div className={`rounded-xl border-2 p-8 text-center transition-all ${
        ativado ? 'bg-red-50 border-red-400 shadow-lg shadow-red-100' : 'bg-white border-slate-200'
      }`}>
        {!ativado ? (
          <>
            <p className="text-slate-600 mb-6">Pressione apenas em caso de emergência comportamental</p>
            <button
              onClick={async () => {
                setAtivado(true);
                // Enviar push notification para todos os profissionais
                if (paciente) {
                  try {
                    const result = await sendCrisisAlert(paciente.id, paciente.nome);
                    setNotificacaoEnviada(true);
                    console.log('Notificações de crise enviadas:', result);
                  } catch (err) {
                    console.error('Erro ao enviar notificações:', err);
                  }
                }
              }}
              className="w-40 h-40 rounded-full bg-red-500 hover:bg-red-600 text-white text-3xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 mx-auto block"
            >
              🚨<br />
              <span className="text-lg">EM CRISE</span>
            </button>
            <p className="text-xs text-slate-400 mt-4">
              {isSubscribed
                ? 'Notificações push serão enviadas automaticamente'
                : 'Ative as notificações push para alertar profissionais automaticamente'}
            </p>
            {!isSubscribed && (
              <button
                onClick={subscribe}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                🔔 Ativar Notificações Push
              </button>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="animate-pulse">
              <span className="text-6xl">🚨</span>
              <h3 className="text-2xl font-bold text-red-700 mt-2">CRISE ATIVADA</h3>
              <p className="text-red-600">Notificando equipe...</p>
            </div>

            {/* Status das notificações */}
            <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-bold text-sm mb-3">📡 Notificações Enviadas</h4>
              <div className="space-y-2">
                {profissionaisProximos.map(prof => (
                  <div key={prof.id} className="flex items-center gap-3 text-sm">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{prof.nome}</span>
                    <span className="text-xs text-emerald-600 ml-auto">✅ Notificado</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Coordenação Clínica</span>
                  <span className="text-xs text-emerald-600 ml-auto">✅ Notificado</span>
                </div>
              </div>
            </div>

            {/* Protocolo */}
            <button
              onClick={() => setProtocolo(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
            >
              📋 Ver Protocolo de Crise
            </button>

            {protocolo && (
              <div className="bg-white rounded-lg p-5 text-left max-w-md mx-auto border border-red-200">
                <h4 className="font-bold text-red-700 mb-3">📋 Protocolo ABA para Crise</h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span><strong>Garanta segurança:</strong> remova objetos perigosos do alcance</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span><strong>Reduza estímulos:</strong> luzes baixas, silêncio, espaço seguro</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span><strong>Não force contato visual</strong> nem contenção física (a menos que haja risco iminente)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    <span><strong>Ofereça alternativa sensorial:</strong> colete de peso, fone de abafamento, brinquedo proprioceptivo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                    <span><strong>Após a crise:</strong> registre duração, gatilho provável e comportamento no diário</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Resolver */}
            <button
              onClick={() => { setAtivado(false); setProtocolo(false); }}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300"
            >
              ✅ Crise Encerrada
            </button>
          </div>
        )}
      </div>

      {/* Histórico de crises */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-4">📊 Histórico de Crises</h3>
        <div className="space-y-3">
          {[
            { data: '14/05/2026', hora: '16:00', duracao: '12min', gatilho: 'Mudança de rotina', resolucao: 'Espaço seguro + colete de peso' },
            { data: '10/05/2026', hora: '14:30', duracao: '8min', gatilho: 'Ruído alto (obras)', resolucao: 'Fone de abafamento' },
            { data: '07/05/2026', hora: '09:15', duracao: '20min', gatilho: 'Transição abrupta', resolucao: 'Timer visual + rotina de transição' },
          ].map((crise, i) => (
            <div key={i} className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-red-700">🚨 {crise.data} às {crise.hora}</span>
                <span className="text-xs text-red-600">⏱️ {crise.duracao}</span>
              </div>
              <p className="text-xs text-slate-600">Gatilho: {crise.gatilho}</p>
              <p className="text-xs text-emerald-600 mt-1">Resolução: {crise.resolucao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
