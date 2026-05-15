import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } from '@/lib/vapid';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Em produção, viria do banco
const subscriptions: Map<string, webpush.PushSubscription> = new Map();

interface NotifyPayload {
  userIds: string[];        // IDs dos usuários alvo
  title: string;
  body: string;
  url?: string;
  tipo?: 'geral' | 'crise' | 'conquista' | 'tarefa' | 'insight';
  pacienteId?: string;
  pacienteNome?: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: NotifyPayload = await request.json();

    if (!payload.userIds || !payload.title) {
      return NextResponse.json({ error: 'userIds e title são obrigatórios' }, { status: 400 });
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      url: payload.url || '/',
      tipo: payload.tipo || 'geral',
      pacienteId: payload.pacienteId,
      image: payload.image,
      vibrate: payload.tipo === 'crise' ? [500, 200, 500, 200, 500] : [200, 100, 200],
      requireInteraction: payload.tipo === 'crise',
      renotify: true,
      actions: payload.tipo === 'crise'
        ? [
            { action: 'ver_protocolo', title: '📋 Ver Protocolo' },
            { action: 'aceitar', title: '✅ Atender' },
          ]
        : [],
    });

    const results = [];

    for (const userId of payload.userIds) {
      const subscription = subscriptions.get(userId);
      if (!subscription) continue;

      try {
        await webpush.sendNotification(subscription, notificationPayload);
        results.push({ userId, status: 'enviado' });
      } catch (error: any) {
        // Subscription expirou ou inválida
        if (error.statusCode === 410) {
          subscriptions.delete(userId);
          // Em produção: await supabase.from('push_subscriptions').delete().eq('user_id', userId);
        }
        results.push({ userId, status: 'erro', error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      enviados: results.filter(r => r.status === 'enviado').length,
      erros: results.filter(r => r.status === 'erro').length,
      detalhes: results,
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
