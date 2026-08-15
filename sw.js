const CACHE = 'dinocrawler-v7';
const ASSETS = [
  '/DinoCrawler/',
  '/DinoCrawler/index.html',
  '/DinoCrawler/manifest.json',
  '/DinoCrawler/icon192.png',
  '/DinoCrawler/icon512.png',
  '/DinoCrawler/audio/01-ui-click-001.ogg',
  '/DinoCrawler/audio/02-ui-click-002.ogg',
  '/DinoCrawler/audio/05-ui-confirmation-001.ogg',
  '/DinoCrawler/audio/06-ui-open-001.ogg',
  '/DinoCrawler/audio/09-scan-computer-001.ogg',
  '/DinoCrawler/audio/10-scan-glitch-001.ogg',
  '/DinoCrawler/audio/11-scan-switch-001.ogg',
  '/DinoCrawler/audio/14-laser-small-000.ogg',
  '/DinoCrawler/audio/15-laser-large-000.ogg',
  '/DinoCrawler/audio/16-grenade-crunch-000.ogg',
  '/DinoCrawler/audio/20-taser-forcefield-001.ogg',
  '/DinoCrawler/audio/23-machete-metal-000.ogg',
  '/DinoCrawler/audio/24-machete-mining-000.ogg',
  '/DinoCrawler/audio/30-machine-space-low-000.ogg',
  '/DinoCrawler/audio/35-equip-switch-002.ogg',
  '/DinoCrawler/audio/bush-rustle-02.flac',
  '/DinoCrawler/audio/fire-crackle.ogg',
  '/DinoCrawler/audio/forest-ambience.mp3',
  '/DinoCrawler/audio/jungle-music.ogg',
  '/DinoCrawler/audio/menu-back-slide-electronic-00.mp3',
  '/DinoCrawler/audio/menu-metal-energetic.ogg',
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
