const CACHE_NAME = "shopinger-pwa-v1";

// Static assets to precache on service worker installation
// NOTE: Do NOT include "/" here — it's dynamic HTML that changes per build.
// The NetworkFirst navigation handler caches it on first visit automatically.
const PRECACHE_ASSETS = [
  "/manifest.json",
  "/favicon.ico",
  "/shopinger-logo.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// Paths and origins that MUST NEVER be cached under any circumstances
const SENSITIVE_PATH_PATTERNS = [
  /\/api\//i,
  /\/auth\//i,
  /\/cart/i,
  /\/checkout/i,
  /\/account/i,
  /\/order/i,
  /\/user/i,
  /\/profile/i,
  /\/wishlist/i,
  /\/login/i,
  /\/admin/i,
  /\/_next\/data\//i, // Next.js client-side navigation JSON — must stay fresh
];

// 1. Install Event - Precache critical static app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// 2. Activate Event - Claim clients & purge outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Helper: Check if a request URL matches sensitive API or user paths
function isSensitiveRequest(urlStr, method) {
  if (method !== "GET") return true;

  try {
    const url = new URL(urlStr);
    // Ignore non-http(s) schemes like chrome-extension://
    if (url.protocol !== "http:" && url.protocol !== "https:") return true;

    // Skip requests to external origins (CDN, analytics, third-party scripts)
    if (url.origin !== self.location.origin) return true;

    // Any request to backend API host or containing sensitive path keywords
    return SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname));
  } catch {
    return true;
  }
}

// 3. Fetch Event - Intelligent caching with strict API & auth safety
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Bypass non-GET, Chrome extension, API, or authenticated user requests
  if (isSensitiveRequest(request.url, request.method)) {
    return;
  }

  // Handle navigation requests (HTML pages) - Network First strategy
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match("/");
          });
        }),
    );
    return;
  }

  // Handle Static Assets (_next/static, images, fonts, css, scripts) - Stale-While-Revalidate strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    }),
  );
});

// Listen for skipWaiting messages from client registration updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
