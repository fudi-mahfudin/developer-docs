// Registers the service worker (ADR 0004). build-pwa.js injects this script into every page of the
// deployed site only; it does nothing on file:// or in browsers without service workers.
(function () {
  var secure = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!secure || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(function (err) {
    console.warn("Service worker gagal didaftarkan:", err);
  });
})();
