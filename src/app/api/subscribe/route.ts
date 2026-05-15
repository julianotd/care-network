import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } from '@/lib/vapid';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Em produção, isso viria do banco de dados
// Tabela: push_subscriptions (user_id, endpoint, keys_p256dh, keys_auth)
const subscriptions: Map<string, webpush.PushSubscription> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscription } = body;

    if (!userId || !subscription) {
      return NextResponse.json({ error: 'userId e subscription são obrigatórios' }, { status: 400 });
    }

    // Salvar subscription (em memória para demo, em produção → Supabase)
    subscriptions.set(userId, subscription);

    // Em produção:
    // await supabase.from('push_subscriptions').upsert({
    //   user_id: userId,
    //   endpoint: subscription.endpoint,
    //   keys_p256dh: subscription.keys.p256dh,
    //   keys_auth: subscription.keys.auth,
    // });

    return NextResponse.json({ success: true, message: 'Subscription registrada' });
  } catch (error) {
    console.error('Erro ao registrar subscription:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET() {
  // Retorna a VAPID public key para o frontend usar
  return NextResponse.json({ publicKey: VAPID_PUBLIC_KEY });
}
