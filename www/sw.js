// RST • Ready Set Train — Service Worker (retired)
//
// This service worker used to precache the app shell for offline use, but
// its cache-first strategy meant users could get stuck on an old cached
// version of index.html indefinitely — new deployments never reached them.
//
// It now does one job: clean itself up. On activate it deletes every cache
// it owns, unregisters itself, and reloads any open tabs so they fetch
// fresh, uncached content straight from the network from now on.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});
