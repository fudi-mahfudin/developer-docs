/*
 * Latihan mengurutkan langkah (mis. satu siklus TDD), dengan feedback langsung.
 *
 * Markup (tulis langkah dalam URUTAN BENAR; komponen yang mengacaknya):
 *   <div class="order" data-title="Urutkan satu siklus">
 *     <ol class="steps">
 *       <li>Langkah pertama</li>
 *       <li>Langkah kedua</li>
 *     </ol>
 *     <p class="explain">Penjelasan yang muncul setelah semua langkah dipilih.</p>
 *   </div>
 *   <script src="../assets/order.js"></script>
 *
 * Pengguna mengklik langkah sesuai urutan yang ia yakini. Setelah langkah terakhir,
 * setiap posisi ditandai benar/salah, urutan benar ditampilkan, plus tombol Ulangi.
 * Logic murni (scramble, checkOrder) diuji di tests/order.test.js.
 */
(function (root) {
  // Permutation of 0..n-1 that is never already solved (for n >= 2).
  function scramble(n, rng = Math.random) {
    const out = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (n > 1 && out.every((v, i) => v === i)) out.push(out.shift());
    return out;
  }

  // picked: step indices in the order the user chose them.
  function checkOrder(picked) {
    const marks = picked.map((v, i) => v === i);
    const right = marks.filter(Boolean).length;
    return { marks, right, solved: right === picked.length };
  }

  const api = { scramble, checkOrder };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  root.OrderDrill = api;

  const css = `
  .order { margin: 1.2rem 0; }
  .order ol.steps { display: none; }
  .order .pool { display: flex; flex-direction: column; gap: .45rem; margin: .4rem 0 1rem; }
  .order button {
    font: inherit; font-size: .9rem; cursor: pointer; text-align: left;
    background: #fff; border: 1px solid var(--ink); padding: .35rem .75rem;
  }
  .order button:hover:not(:disabled) { background: var(--code-bg); }
  .order .pool button:disabled { visibility: hidden; }
  .order .label { font-family: -apple-system, sans-serif; font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  .order ol.picked { margin: .3rem 0 .8rem; padding-left: 1.6rem; }
  .order ol.picked li { padding: .2rem .4rem; margin: .15rem 0; }
  .order ol.picked li.correct { background: var(--ok-bg); color: var(--ok); }
  .order ol.picked li.wrong { background: var(--bad-bg); color: var(--bad); }
  .order ol.picked li .should { font-size: .8rem; margin-left: .4rem; }
  .order .result { display: none; }
  .order.done .result { display: block; }
  .order.done .explain { display: block; }
  .order .explain { display: none; font-size: .9rem; color: var(--muted); }
  .order .score { font-family: -apple-system, sans-serif; font-size: .88rem; display: flex; gap: 1rem; align-items: center; margin-top: .6rem; }
  @media print { .order .pool, .order .score button { display: none; } .order ol.steps { display: block; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll(".order").forEach(initOrder);

  function initOrder(el) {
    const steps = [...el.querySelectorAll("ol.steps > li")].map(li => li.innerHTML);
    const pool = document.createElement("div");
    pool.className = "pool";
    const pickedLabel = document.createElement("div");
    pickedLabel.className = "label";
    pickedLabel.textContent = "Urutan Anda";
    const pickedList = document.createElement("ol");
    pickedList.className = "picked";
    const result = document.createElement("div");
    result.className = "result";
    const score = document.createElement("div");
    score.className = "score";
    const explain = el.querySelector(".explain");
    el.insertBefore(pool, el.querySelector("ol.steps"));
    el.insertBefore(pickedLabel, explain);
    el.insertBefore(pickedList, explain);
    el.insertBefore(result, explain);
    el.appendChild(score);

    let picked = [];

    function start() {
      picked = [];
      el.classList.remove("done");
      pool.innerHTML = "";
      scramble(steps.length).forEach(i => {
        const b = document.createElement("button");
        b.innerHTML = steps[i];
        b.dataset.step = i;
        b.onclick = () => { picked.push(i); b.disabled = true; render(); };
        pool.appendChild(b);
      });
      render();
    }

    function render() {
      const done = picked.length === steps.length;
      const check = done ? checkOrder(picked) : null;
      pickedList.innerHTML = picked.map((i, pos) => {
        if (!done) return `<li>${steps[i]}</li>`;
        const ok = check.marks[pos];
        return `<li class="${ok ? "correct" : "wrong"}">${steps[i]}${ok ? "" : `<span class="should">(seharusnya no. ${i + 1})</span>`}</li>`;
      }).join("") || `<li style="list-style:none;color:var(--muted)">Klik langkah di atas sesuai urutannya.</li>`;
      score.innerHTML = "";
      if (done) {
        el.classList.add("done");
        result.innerHTML = check.solved ? "" :
          `<div class="label">Urutan benar</div><ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>`;
        score.innerHTML = `<span>Posisi benar: <strong>${check.right}/${steps.length}</strong></span>`;
        const again = document.createElement("button");
        again.textContent = "Ulangi";
        again.onclick = start;
        score.appendChild(again);
      } else {
        score.innerHTML = `<span>${steps.length - picked.length} langkah tersisa</span>`;
        if (picked.length) {
          const undo = document.createElement("button");
          undo.textContent = "Batalkan langkah terakhir";
          undo.onclick = () => {
            const i = picked.pop();
            [...pool.children].find(b => b.dataset.step === String(i)).disabled = false;
            render();
          };
          score.appendChild(undo);
        }
      }
    }

    start();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
