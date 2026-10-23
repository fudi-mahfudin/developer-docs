/*
 * Timer bersegmen untuk latihan yang dibatasi waktu (mis. mock interview 0018: konsep, live coding, STAR).
 *
 * Markup:
 *   <div class="timer" data-segments="Konsep:20,Live coding:25,STAR:15"></div>
 *   <script src="../assets/timer.js"></script>
 *
 * Tombol Mulai/Jeda/Reset. Segmen berganti otomatis saat waktunya habis (seperti pewawancara yang
 * memotong), dan segmen yang sedang berjalan disorot di daftar. Waktu dihitung dari jam sistem,
 * jadi tetap akurat walau tab sempat tidak aktif.
 * Pure logic (parseSegments, timerState, formatClock) diuji di tests/timer.test.js lewat require().
 */
(function (root) {
  function parseSegments(spec) {
    const segs = String(spec || "").split(",").map(s => s.trim()).filter(Boolean).map(part => {
      const at = part.lastIndexOf(":");
      const label = part.slice(0, at).trim();
      const minutes = Number(part.slice(at + 1));
      if (at < 1 || !label || !(minutes > 0)) throw new Error(`Segmen timer "${part}" tidak valid (format "Label:menit")`);
      return { label, ms: minutes * 60 * 1000 };
    });
    if (!segs.length) throw new Error("Timer butuh minimal satu segmen");
    return segs;
  }

  function timerState(segments, elapsedMs) {
    const total = segments.reduce((sum, s) => sum + s.ms, 0);
    const elapsed = Math.max(0, elapsedMs);
    if (elapsed >= total) {
      const last = segments.length - 1;
      return { index: last, label: segments[last].label, remainingMs: 0, totalRemainingMs: 0, done: true };
    }
    let start = 0;
    for (let i = 0; i < segments.length; i++) {
      const end = start + segments[i].ms;
      if (elapsed < end) {
        return { index: i, label: segments[i].label, remainingMs: end - elapsed, totalRemainingMs: total - elapsed, done: false };
      }
      start = end;
    }
  }

  function formatClock(ms) {
    const secs = Math.max(0, Math.ceil(ms / 1000));
    const pad = n => String(n).padStart(2, "0");
    return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
  }

  const api = { parseSegments, timerState, formatClock };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  root.SegmentTimer = api;

  const css = `
  .timer { position: sticky; top: 0; z-index: 5; background: #fff; border: 1px solid var(--ink);
    padding: .6rem .8rem; margin: 1.2rem 0; font-family: -apple-system, sans-serif; }
  .timer .row { display: flex; gap: .8rem; align-items: baseline; flex-wrap: wrap; }
  .timer .clock { font-family: "SF Mono", Menlo, monospace; font-size: 1.8rem; }
  .timer .now { font-size: .95rem; }
  .timer .total { font-size: .8rem; color: var(--muted); }
  .timer ol { list-style: none; padding: 0; margin: .4rem 0 0; display: flex; gap: .4rem; flex-wrap: wrap; font-size: .8rem; }
  .timer li { border: 1px solid var(--rule); padding: .1rem .5rem; color: var(--muted); }
  .timer li.active { border-color: var(--accent); color: var(--accent); }
  .timer li.past { text-decoration: line-through; }
  .timer button { font: inherit; font-size: .85rem; cursor: pointer; background: #fff; border: 1px solid var(--ink); padding: .2rem .7rem; }
  .timer button:hover { background: var(--code-bg); }
  .timer.done .clock { color: var(--bad); }
  @media print { .timer { display: none; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll(".timer").forEach(initTimer);

  function initTimer(box) {
    const segs = parseSegments(box.dataset.segments);
    let elapsedBefore = 0;   // ms accumulated before the current run
    let startedAt = null;    // Date.now() when the current run began, null when paused
    let tick = null;

    box.innerHTML = `
      <div class="row">
        <span class="clock"></span><span class="now"></span><span class="total"></span>
        <button type="button" data-act="toggle">Mulai</button>
        <button type="button" data-act="reset">Reset</button>
      </div>
      <ol>${segs.map(s => `<li>${s.label} · ${formatClock(s.ms).replace(/:00$/, "")} mnt</li>`).join("")}</ol>`;
    const clock = box.querySelector(".clock");
    const now = box.querySelector(".now");
    const total = box.querySelector(".total");
    const toggle = box.querySelector('[data-act="toggle"]');
    const items = [...box.querySelectorAll("li")];

    const elapsed = () => elapsedBefore + (startedAt === null ? 0 : Date.now() - startedAt);

    function render() {
      const st = timerState(segs, elapsed());
      clock.textContent = formatClock(st.remainingMs);
      now.textContent = st.done ? "Waktu habis. Berhenti dan isi penilaian." : `Bagian ${st.index + 1}: ${st.label}`;
      total.textContent = `sisa total ${formatClock(st.totalRemainingMs)}`;
      items.forEach((li, i) => {
        li.classList.toggle("active", !st.done && i === st.index);
        li.classList.toggle("past", st.done || i < st.index);
      });
      box.classList.toggle("done", st.done);
      if (st.done) pause();
    }

    function pause() {
      if (startedAt !== null) { elapsedBefore = elapsed(); startedAt = null; }
      clearInterval(tick);
      toggle.textContent = "Lanjut";
    }

    toggle.onclick = () => {
      if (startedAt !== null) { pause(); render(); return; }
      if (timerState(segs, elapsed()).done) return;
      startedAt = Date.now();
      toggle.textContent = "Jeda";
      tick = setInterval(render, 250);
      render();
    };
    box.querySelector('[data-act="reset"]').onclick = () => {
      pause();
      elapsedBefore = 0;
      toggle.textContent = "Mulai";
      render();
    };
    render();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
