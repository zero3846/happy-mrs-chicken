const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    '/styles/styles.css',
    '/js/main.js'
];

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');
})

self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log(`Service Worker: Clearing old cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', e => {
    console.log(`Service Worker: Fetching ${e.request.url}`);

    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (e.request.url.startsWith('http')) {
                    const resClone = res.clone();
                    caches
                        .open(cacheName)
                        .then(cache => cache.put(e.request, resClone));
                }
                return res;
            })
            .catch(err => {
                caches
                    .match(e.request)
                    .then(res => res)
            })
    )
})