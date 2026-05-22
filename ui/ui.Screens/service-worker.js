// 🌸 LOTUS ASSISTANT — SERVICE WORKER
// Handles offline caching, updates, and boot stability

const CACHE_NAME = "lotus-assistant-v1";

// ⭐ Files required for offline boot (RELATIVE to service-worker.js)
const urlsToCache = [
  "./app.html",
  "./assistant.html",

  // Only include files that ACTUALLY exist
  "../ui.Scripts/index.js",

  // CSS files MUST be cached or offline mode will look broken
  "../ui.Styles/main.css",
  "../ui.Styles/components.css",

  "./lotus.png",
  "./lotus-192.png",

  "./manifest.json"
];

// 🌸 INSTALL — Cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 🌸 ACTIVATE — Clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  clients.claim();
});

// 🌸 FETCH — EXTENSION‑BASED HANDLING ONLY
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Strip query parameters (?v=9999, etc.)
  const cleanURL = url.origin + url.pathname;

  event.respondWith(
    caches.match(cleanURL).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        const accept = event.request.headers.get("accept") || "";

        // HTML fallback
        if (accept.includes("text/html")) {
          return caches.match("./app.html");
        }

        // EXTENSION‑BASED FALLBACKS ONLY

        // CSS fallback
        if (cleanURL.endsWith(".css")) {
          return new Response("/* offline css */", {
            headers: { "Content-Type": "text/css" }
          });
        }

        // JS fallback
        if (cleanURL.endsWith(".js")) {
          return new Response("// offline js", {
            headers: { "Content-Type": "application/javascript" }
          });
        }

        // JSON fallback
        if (cleanURL.endsWith(".json")) {
          return new Response("{}", {
            headers: { "Content-Type": "application/json" }
          });
        }

        // Default fallback
        return new Response("", { status: 200 });
      });
    })
  );
});

// 🌸 UPDATE DETECTION
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
