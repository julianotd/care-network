// Care Network — Service Worker para Push Notifications

self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || 'Nova notificação do Care Network',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    image: data.image,
    vibrate: data.vibrate || [200, 100, 200],
    tag: data.tag || 'care-network',
    renotify: data.renotify || true,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: {
      url: data.url || '/',
      pacienteId: data.pacienteId,
      tipo: data.tipo || 'geral',
    },
  };

  // Crise: vibração intensa
  if (data.tipo === 'crise') {
    options.vibrate = [500, 200, 500, 200, 500, 200, 500];
    options.requireInteraction = true;
    options.tag = 'crise-' + data.pacienteId;
    options.renotify = true;
    options.actions = [
      { action: 'ver_protocolo', title: '📋 Ver Protocolo' },
      { action: 'aceitar', title: '✅ Atender' },
    ];
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Care Network', options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'ver_protocolo') {
    event.waitUntil(clients.openWindow('/crise/' + data.pacienteId));
    return;
  }

  if (action === 'aceitar') {
    // Envia mensagem para o app marcar atendimento
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function (clientList) {
        if (clientList.length > 0) {
          clientList[0].postMessage({
            type: 'CRISE_ACEITA',
            pacienteId: data.pacienteId,
          });
        }
      })
    );
    return;
  }

  // Default: abre a URL
  event.waitUntil(clients.openWindow(data.url || '/'));
});

// Background sync para notificações offline
self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Envia notificações pendentes quando voltar online
  try {
    const cache = await caches.open('pending-notifications');
    const requests = await cache.keys();
    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await cache.delete(request);
    }
  } catch (err) {
    console.error('Sync failed:', err);
  }
}
