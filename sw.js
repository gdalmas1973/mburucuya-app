const CACHE = 'mbu-202605281716';

self.addEventListener('install', (e) => {
  e.waitUntil(
    fetch('/', {cache:'no-store'})
      .then(r => caches.open(CACHE).then(c => c.put('/', r)))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:'window', includeUncontrolled:true}))
      .then(cs => cs.forEach(c => c.postMessage({type:'UPDATE'})))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, {cache:'no-store'})
        .then(r => { caches.open(CACHE).then(c => c.put('/', r.clone())); return r; })
        .catch(() => caches.match('/'))
    );
  }
});

self.addEventListener('push', (e) => {
  const d = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(d.title || '📢 Mburucuyá', {
      body: d.body || 'Nueva novedad del edificio',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: d.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow('/');
    })
  );
});
