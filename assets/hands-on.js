/*
 * Hands-on components for the database lessons (0019+). Runs from file:// (no fetch).
 *
 * 1. Script block with a copy button. Paste the .sql file's content verbatim (HTML-escaped:
 *    & -> &amp;, < -> &lt;, > -> &gt;). data-file names the source file, relative to the repo
 *    root; the .sql file is the source of truth and tests/helpers.js assertScriptsMatchFiles
 *    checks the two are identical.
 *
 *   <pre class="script" data-file="lab/0019-sql-dasar.sql"><code>SELECT …</code></pre>
 *
 * 2. Write-it-yourself exercise with a hidden answer (not graded automatically):
 *
 *   <div class="sql-exercise">
 *     <p class="prompt">Tulis query untuk 3 Product termahal per Category.</p>
 *     <details class="answer"><summary>Lihat jawaban</summary>
 *       <pre><code>WITH ranked AS (…) SELECT …</code></pre>
 *       <p>Penjelasan singkat.</p>
 *     </details>
 *   </div>
 */
(function () {
  const css = `
  .script-wrap { position: relative; margin: 1rem 0; }
  .script-wrap .script-file {
    font-family: -apple-system, "Helvetica Neue", sans-serif; font-size: .75rem; color: var(--muted);
    margin-bottom: .2rem;
  }
  .script-wrap pre { margin: 0; }
  .script-wrap .copy {
    position: absolute; top: 1.4rem; right: .4rem;
    font: inherit; font-size: .78rem; cursor: pointer;
    background: #fff; border: 1px solid var(--ink); padding: .2rem .6rem;
  }
  .sql-exercise { border-left: 3px solid var(--accent); padding-left: .9rem; margin: 1.4rem 0; }
  .sql-exercise .prompt { margin: 0 0 .4rem; }
  details.answer { border: none; padding: 0; background: none; }
  details.answer summary {
    display: inline-block; list-style: none;
    border: 1px solid var(--ink); padding: .25rem .7rem; background: #fff; color: var(--ink);
  }
  details.answer summary::-webkit-details-marker { display: none; }
  @media print { .script-wrap .copy, details.answer summary { display: none; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Clipboard API needs a secure context; fall back to a hidden textarea + execCommand.
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  document.querySelectorAll("pre.script").forEach(pre => {
    const wrap = document.createElement("div");
    wrap.className = "script-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    const label = document.createElement("div");
    label.className = "script-file";
    label.textContent = pre.dataset.file || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      copy(pre.textContent).then(
        () => { btn.textContent = "Tersalin"; },
        () => { btn.textContent = "Gagal, salin manual"; }
      ).finally(() => setTimeout(() => { btn.textContent = "Copy"; }, 1500));
    });
    wrap.append(label, pre, btn);
  });
})();
