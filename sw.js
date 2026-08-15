const CACHE = 'dinocrawler-v6';
const ASSETS = [
  '/DinoCrawler/',
  '/DinoCrawler/index.html',
  '/DinoCrawler/manifest.json',
  '/DinoCrawler/icon192.png',
  '/DinoCrawler/icon512.png',
  '/DinoCrawler/audio/forest-ambience.mp3',
  '/DinoCrawler/audio/jungle-music.ogg',
  '/DinoCrawler/audio/rex-tension.ogg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
