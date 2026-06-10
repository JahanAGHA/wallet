const CACHE = 'wallet-v7';
const FILES = ['./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./icon-maskable.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(FILES.map(f => c.add(new Request(f,{cache:'reload'}))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp&&resp.ok&&resp.type==='basic'){const c=resp.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
