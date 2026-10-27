/*
 * Latihan "susun urutan" dengan feedback langsung (mis. urutan middleware, prioritas konfigurasi).
 *
 * Markup (tulis item dalam urutan BENAR; komponen mengacaknya saat halaman dibuka):
 *   <div class="order">
 *     <ol>
 *       <li>app.UseExceptionHandler()</li>
 *       <li>app.UseRouting()</li>
 *       …
 *     </ol>
 *     <p class="explain">Penjelasan yang muncul setelah urutan benar atau setelah "Lihat jawaban".</p>
 *   </div>
 *   <script src="../assets/order.js"></script>
 *
 * Pengguna memindah item dengan tombol ↑/↓, lalu "Periksa": setiap posisi ditandai benar/salah.
 * Pure logic (checkOrder, scramble) diuji di tests/shared/order.test.js lewat require().
 */
(function (root) {
  function checkOrder(expected, given) {
    const marks = expected.map((item, i) => given[i] === item);
    const right = marks.filter(Boolean).length;
    return { right, total: expected.length, solved: right === expected.length, marks };
  }

  // Fisher-Yates; if the result happens to be the solved order, rotate by one so the user always has work to do.
  function scramble(items, rng = Math.random) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift());
    return out;
  }

  const api = { checkOrder, scramble };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  root.OrderExercise = api;

  const css = `
  .order { margin: 1.2rem 0; }
  .order ol { list-style: none; padding: 0; margin: 0; counter-reset: step; }
  .order li { display: flex; align-items: center; gap: .6rem; padding: .4rem .6rem; margin: .3rem 0;
    background: #fff; border: 1px solid var(--rule); counter-increment: step; }
  .order li::before { content: counter(step); font-family: -apple-system, sans-serif; font-size: .75rem; color: var(--muted); min-width: 1.2rem; }
  .order li .item { flex: 1; }
  .order li.ok { border-color: var(--ok); background: var(--ok-bg); }
  .order li.no { border-color: var(--bad); background: var(--bad-bg); }
  .order button { font: inherit; font-size: .85rem; cursor: pointer; background: #fff; border: 1px solid var(--ink); padding: .2rem .6rem; }
  .order button:hover:not(:disabled) { background: var(--code-bg); }
  .order button:disabled { opacity: .35; cursor: default; }
  .order .moves { display: flex; gap: .25rem; }
  .order .moves button { padding: .1rem .45rem; }
  .order .explain { display: none; font-size: .9rem; color: var(--muted); margin: .6rem 0 0; }
  .order.revealed .explain { display: block; }
  .order .score { font-family: -apple-system, sans-serif; font-size: .88rem; margin-top: .8rem; display: flex; gap: .6rem; align-items: center; flex-wrap: wrap; }
  .order .verdict.ok { color: var(--ok); } .order .verdict.no { color: var(--bad); }
  @media print { .order .moves, .order .score button { display: none; } }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll(".order").forEach(initOrder);

  function initOrder(box) {
    const list = box.querySelector("ol");
    const expected = [...list.children].map(li => li.innerHTML.trim());
    let current = scramble(expected);
    let tries = 0;

    const score = document.createElement("div");
    score.className = "score";
    box.appendChild(score);

    function renderList(marks) {
      list.innerHTML = "";
      current.forEach((html, i) => {
        const li = document.createElement("li");
        if (marks) li.className = marks[i] ? "ok" : "no";
        li.innerHTML = `<span class="item">${html}</span><span class="moves">
          <button aria-label="Naikkan" ${i === 0 ? "disabled" : ""}>↑</button>
          <button aria-label="Turunkan" ${i === current.length - 1 ? "disabled" : ""}>↓</button></span>`;
        const [up, down] = li.querySelectorAll("button");
        up.onclick = () => move(i, -1);
        down.onclick = () => move(i, 1);
        list.appendChild(li);
      });
    }

    function move(i, d) {
      [current[i], current[i + d]] = [current[i + d], current[i]];
      renderList();
      renderScore();
    }

    function renderScore(result) {
      score.innerHTML = "";
      const check = button("Periksa", () => {
        tries += 1;
        const r = checkOrder(expected, current);
        if (r.solved) box.classList.add("revealed");
        renderList(r.marks);
        renderScore(r);
      });
      score.appendChild(check);
      if (result) {
        const v = document.createElement("span");
        v.className = "verdict " + (result.solved ? "ok" : "no");
        v.textContent = result.solved
          ? `Benar semua (${tries}× periksa)`
          : `${result.right}/${result.total} posisi benar. Pindahkan yang merah, lalu periksa lagi.`;
        score.appendChild(v);
      }
      if (!box.classList.contains("revealed")) {
        score.appendChild(button("Lihat jawaban", () => {
          current = expected.slice();
          box.classList.add("revealed");
          renderList(checkOrder(expected, current).marks);
          renderScore();
        }));
      }
      score.appendChild(button("Acak ulang", () => {
        current = scramble(expected);
        tries = 0;
        box.classList.remove("revealed");
        renderList();
        renderScore();
      }));
    }

    function button(label, onclick) {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick = onclick;
      return b;
    }

    renderList();
    renderScore();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
