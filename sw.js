const CACHE = 'mburucuya-v3';
const LOCAL = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Solo cachear archivos locales, no tocar peticiones a Supabase u otros dominios
  if(!LOCAL.includes(new URL(e.request.url).pathname)) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
