'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface NotificationContextType {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | 'unsupported';
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendNotification: (params: SendNotificationParams) => Promise<any>;
  sendCrisisAlert: (pacienteId: string, pacienteNome: string) => Promise<any>;
}

interface SendNotificationParams {
  userIds: string[];
  title: string;
  body: string;
  url?: string;
  tipo?: 'geral' | 'crise' | 'conquista' | 'tarefa' | 'insight';
  pacienteId?: string;
  pacienteNome?: string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      // Registrar service worker
      navigator.serviceWorker.register('/sw.js').then(reg => {
        setRegistration(reg);

        // Verificar se já está inscrito
        reg.pushManager.getSubscription().then(sub => {
          setIsSubscribed(!!sub);
        });
      }).catch(err => {
        console.error('SW registration failed:', err);
      });
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;

    try {
      // Pedir permissão
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') return false;

      // Buscar VAPID public key do servidor
      const res = await fetch('/api/subscribe');
      const { publicKey } = await res.json();

      // Inscrever
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Registrar no servidor
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user', // Em produção: ID real do Supabase Auth
          subscription: subscription.toJSON(),
        }),
      });

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      return false;
    }
  }, [registration]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('Erro ao desinscrever:', error);
      return false;
    }
  }, [registration]);

  const sendNotification = useCallback(async (params: SendNotificationParams) => {
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return { error: 'Falha ao enviar' };
    }
  }, []);

  const sendCrisisAlert = useCallback(async (pacienteId: string, pacienteNome: string) => {
    // Buscar profissionais do paciente (em produção: query no Supabase)
    const profissionalIds = ['user-prof-1', 'user-prof-2', 'user-coord-1'];

    return sendNotification({
      userIds: profissionalIds,
      title: `🚨 CRISE — ${pacienteNome}`,
      body: `Emergência comportacional. Toque para ver o protocolo de crise.`,
      url: `/crise/${pacienteId}`,
      tipo: 'crise',
      pacienteId,
      pacienteNome,
    });
  }, [sendNotification]);

  return (
    <NotificationContext.Provider value={{
      isSupported,
      isSubscribed,
      permission,
      subscribe,
      unsubscribe,
      sendNotification,
      sendCrisisAlert,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

// Helper: converter VAPID key
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}
