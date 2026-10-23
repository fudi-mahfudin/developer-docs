/*
 * Komponen review campuran (interleaving). Butuh: bank.js + file assets/questions/NNNN.js.
 * Lihat assets/README.md.
 *
 * Markup:
 *   <div class="review"
 *        data-title="Review 0007"
 *        data-lessons="0001,0002,0003"     lesson sumber
 *        data-topics="di-lifetime"         (opsional) topik tambahan, mis. topik lemah review sebelumnya
 *        data-mc="10" data-oral="2"></div> jumlah soal kuis & lisan yang ditarik
 *
 * Seed acak tampil di halaman; `?seed=123` di URL mengulang urutan yang sama.
 */
(function () {
  const QB = window.QuestionBank;
  const css = `
  .review { margin: 1.2rem 0; }
  .review .meta { font-family: -apple-system, sans-serif; font-size: .8rem; color: var(--muted); display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .review .item { padding: .9rem 0 1rem; border-bottom: 1px solid var(--rule); }
  .review .tag { font-family: -apple-system, sans-serif; font-size: .7rem; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
  .review .prompt { margin: .2rem 0 .6rem; }
  .review .opts { display: flex; flex-direction: column; gap: .45rem; }
  .review button {
    font: inherit; font-size: .9rem; cursor: pointer;
    background: #fff; border: 1px solid var(--ink); padding: .35rem .75rem; text-align: left;
  }
  .review button:hover:not(:disabled) { background: var(--code-bg); }
  .review button:disabled { cursor: default; }
  .review button.correct { background: var(--ok-bg); border-color: var(--ok); color: var(--ok); }
  .review button.wrong { background: var(--bad-bg); border-color: var(--bad); color: var(--bad); text-decoration: line-through; }
  .review .explain { display: none; font-size: .9rem; color: var(--muted); margin: .6rem 0 0; }
  .review .item.done .explain { display: block; }
  .review .verdict { font-family: -apple-system, sans-serif; font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; margin-right: .4rem; }
  .review .verdict.ok { color: var(--ok); } .review .verdict.no { color: var(--bad); }
  .review .checklist { list-style: none; padding-left: 0; }
  .review .checklist label { cursor: pointer; }
  .review .summary { border-top: 2px solid var(--ink); margin-top: 1.5rem; padding-top: .4rem; }
  .review textarea { width: 100%; min-height: 8rem; font-family: "SF Mono", Menlo, monospace; font-size: .8rem; }
  .review tr.weak td { color: var(--bad); }
  .review tr.quiz-only td { color: var(--muted); }
  @media print {
    .review button { border: none; padding: 0; background: none; }
    .review .controls, .review .summary textarea { display: none; }
    .review details { display: block; }
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const list = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);

  document.querySelectorAll(".review").forEach(initReview);

  function initReview(el) {
    const urlSeed = Number(new URLSearchParams(location.search).get("seed"));
    let seed = urlSeed || Math.floor(Math.random() * 1e6);
    const title = el.dataset.title || "Review";
    const labels = QB.labels();
    const label = t => labels[t] || t;

    function start() {
      const pool = QB.select({ lessons: list(el.dataset.lessons), topics: list(el.dataset.topics) });
      const rng = QB.seededRandom(seed);
      const items = QB.draw(pool, { mc: +el.dataset.mc || 10, oral: +el.dataset.oral || 0 }, rng);
      const results = new Array(items.length);

      el.innerHTML = "";
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.innerHTML = `<span>${items.length} soal · seed ${seed}</span>`;
      const again = document.createElement("button");
      again.className = "controls";
      again.textContent = "Acak ulang";
      again.onclick = () => { seed = Math.floor(Math.random() * 1e6); start(); };
      meta.appendChild(again);
      el.appendChild(meta);
      if (!items.length) {
        el.insertAdjacentHTML("beforeend", `<p class="note">Bank soal kosong untuk lesson ${esc(el.dataset.lessons || "-")}. Pastikan file <code>assets/questions/NNNN.js</code> dimuat sebelum review.js.</p>`);
        return;
      }

      const summary = document.createElement("div");
      summary.className = "summary";
      items.forEach((q, i) => {
        const node = q.type === "oral" ? oralItem(q, i, done) : mcItem(q, i, rng, done);
        el.appendChild(node);
      });
      el.appendChild(summary);
      renderSummary();

      function done(i, result) { results[i] = result; renderSummary(); }

      function renderSummary() {
        const answered = results.filter(Boolean);
        if (answered.length < items.length) {
          summary.innerHTML = `<p class="meta">${answered.length}/${items.length} dijawab. Ringkasan per topik muncul setelah semua soal selesai.</p>`;
          return;
        }
        const scores = QB.scoreByTopic(answered);
        const text = QB.summaryText(scores, { title: `${title} (seed ${seed})`, labels });
        summary.innerHTML = `
          <h3>Ringkasan per topik</h3>
          <table><thead><tr><th>Topik</th><th>Skor</th><th>Status</th></tr></thead><tbody>
          ${scores.map(s => `<tr class="${s.weak ? "weak" : s.status === QB.STATUS.QUIZ_ONLY ? "quiz-only" : ""}"><td>${esc(label(s.topic))}</td><td>${s.right}/${s.total}</td><td>${esc(s.status)}</td></tr>`).join("")}
          </tbody></table>
          <p>Salin teks ini dan tempel ke agent supaya hasilnya dicatat:</p>
          <textarea readonly>${esc(text)}</textarea>
          <p class="controls"><button type="button">Salin</button></p>`;
        const ta = summary.querySelector("textarea");
        summary.querySelector(".controls button").onclick = e => {
          ta.select();
          const ok = navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
          ok.then(() => { e.target.textContent = "Tersalin"; }, () => { document.execCommand("copy"); e.target.textContent = "Tersalin"; });
        };
      }
    }

    function head(q, i, kind) {
      return `<div class="tag">${i + 1} · ${kind} · ${esc(label(q.topic))} · lesson ${esc(q.lesson)}</div><p class="prompt">${q.prompt}</p>`;
    }

    // q.prompt, q.options, q.explain, q.checklist, q.sample are trusted HTML written by lesson authors.
    function mcItem(q, i, rng, done) {
      const node = document.createElement("div");
      node.className = "item";
      const keys = QB.shuffle(Object.keys(q.options), rng);
      node.innerHTML = head(q, i, "Kuis") +
        `<div class="opts">${keys.map(k => `<button type="button" data-key="${esc(k)}">${q.options[k]}</button>`).join("")}</div>` +
        `<p class="explain">${q.explain}</p>`;
      node.querySelectorAll(".opts button").forEach(btn => {
        btn.onclick = () => {
          const ok = btn.dataset.key === q.answer;
          node.classList.add("done");
          node.querySelectorAll(".opts button").forEach(b => {
            b.disabled = true;
            if (b.dataset.key === q.answer) b.classList.add("correct");
          });
          if (!ok) btn.classList.add("wrong");
          node.querySelector(".explain").insertAdjacentHTML("afterbegin",
            `<span class="verdict ${ok ? "ok" : "no"}">${ok ? "Benar" : "Belum tepat"}</span>`);
          done(i, { question: q, ok });
        };
      });
      return node;
    }

    function oralItem(q, i, done) {
      const node = document.createElement("div");
      node.className = "item";
      const need = Math.ceil((q.checklist.length * 2) / 3);
      node.innerHTML = head(q, i, "Lisan") +
        `<p class="note">Jawab dengan suara keras (±60 detik) sebelum membuka checklist.</p>
        <details><summary>Buka checklist dan nilai jawaban Anda</summary>
          ${q.sample ? `<p>${q.sample}</p>` : ""}
          <ul class="checklist">${q.checklist.map(c => `<li><label><input type="checkbox"> ${c}</label></li>`).join("")}</ul>
          <p class="controls"><button type="button">Simpan penilaian (lulus jika ≥ ${need} dari ${q.checklist.length})</button></p>
          <p class="verdict-line"></p>
        </details>`;
      const btn = node.querySelector(".controls button");
      btn.onclick = () => {
        const boxes = [...node.querySelectorAll(".checklist input")];
        const checked = boxes.filter(b => b.checked).length;
        const ok = QB.oralPassed(checked, boxes.length);
        boxes.forEach(b => { b.disabled = true; });
        btn.disabled = true;
        node.classList.add("done");
        node.querySelector(".verdict-line").innerHTML =
          `<span class="verdict ${ok ? "ok" : "no"}">${ok ? "Lulus" : "Belum"}</span> ${checked}/${boxes.length} poin`;
        done(i, { question: q, checked });
      };
      return node;
    }

    start();
  }
})();
