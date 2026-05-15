'use client';

import { useNotifications } from '@/lib/notifications';

export function NotificationSettings() {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = useNotifications();

  if (!isSupported) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold mb-2">🔔 Notificações</h3>
        <p className="text-sm text-slate-500">
          Seu navegador não suporta notificações push. Use Chrome, Firefox ou Edge para receber alertas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 className="font-bold">🔔 Configurações de Notificação</h3>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="font-medium">Notificações Push</p>
          <p className="text-sm text-slate-500">
            Receba alertas de crises, conquistas e lembretes mesmo com o app fechado
          </p>
        </div>
        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isSubscribed
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubscribed ? '🔕 Desativar' : '🔔 Ativar'}
        </button>
      </div>

      {/* Status */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-lg">{permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '⏳'}</p>
          <p className="text-xs text-slate-500 mt-1">Permissão</p>
          <p className="text-xs font-medium">{permission === 'granted' ? 'Concedida' : permission === 'denied' ? 'Negada' : 'Pendente'}</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-lg">{isSubscribed ? '🟢' : '🔴'}</p>
          <p className="text-xs text-slate-500 mt-1">Status</p>
          <p className="text-xs font-medium">{isSubscribed ? 'Ativo' : 'Inativo'}</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-lg">📱</p>
          <p className="text-xs text-slate-500 mt-1">Tipo</p>
          <p className="text-xs font-medium">Web Push</p>
        </div>
      </div>

      {/* Tipos de notificação */}
      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-3">Tipos de Alerta</h4>
        <div className="space-y-2">
          {[
            { icon: '🚨', label: 'Crises', desc: 'Alerta imediato quando família dispara botão de crise', ativo: true, cor: 'red' },
            { icon: '🎉', label: 'Conquistas', desc: 'Novos marcos atingidos pelo paciente', ativo: true, cor: 'emerald' },
            { icon: '📋', label: 'Tarefas', desc: 'Novas tarefas atribuídas ou prazos próximos', ativo: true, cor: 'amber' },
            { icon: '⚡', label: 'Insights', desc: 'Alertas automáticos do sistema (correlações)', ativo: false, cor: 'indigo' },
            { icon: '💬', label: 'Mensagens', desc: 'Novas mensagens nos canais terapêuticos', ativo: false, cor: 'blue' },
          ].map(t => (
            <div key={t.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{t.icon}</span>
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={t.ativo} className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Teste */}
      <button
        onClick={async () => {
          if (Notification.permission === 'granted') {
            new Notification('🧪 Teste — Care Network', {
              body: 'Se você está vendo isso, as notificações estão funcionando!',
              icon: '/icon-192.png',
            });
          }
        }}
        className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
      >
        🧪 Enviar Notificação de Teste
      </button>
    </div>
  );
}
