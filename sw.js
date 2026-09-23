const CACHE = 'mi-app-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './stilos.css',
  './Myscript.js',
  './lista-192.jpg',
  './lista-512.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
