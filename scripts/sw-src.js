// Service worker source, bundled by scripts/build-pwa.js into _site/sw.js (ADR 0004).
// - Every shipped file is precached with a revision hash (self.__WB_MANIFEST).
// - Page navigations: network-first (3 s timeout) so online readers see the latest material,
//   then the precached copy, then /offline.html.
// - Everything else on this origin: served from the precache (cache-first).
import { clientsClaim } from "workbox-core";
import { precache, addRoute, cleanupOutdatedCaches, matchPrecache } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precache(self.__WB_MANIFEST);

// "/fhir/" -> "/fhir/index.html", dropping query and hash, so it matches a precache entry.
function precachePath(url) {
  const { pathname } = new URL(url);
  return pathname.endsWith("/") ? `${pathname}index.html` : pathname;
}

const pages = new NetworkFirst({
  cacheName: "pages",
  networkTimeoutSeconds: 3,
  plugins: [
    {
      handlerDidError: async ({ request }) =>
        (await matchPrecache(precachePath(request.url))) || (await matchPrecache("/offline.html")),
    },
  ],
});

// Registered before addRoute(), so navigations take this route instead of precache-first.
registerRoute(new NavigationRoute(pages));
addRoute();
