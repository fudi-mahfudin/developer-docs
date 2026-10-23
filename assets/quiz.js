/*
 * Reusable quiz component.
 *
 * Markup:
 *   <div class="quiz" data-title="Latihan 1">
 *     <div class="q" data-answer="b">
 *       <p class="prompt">Pertanyaan…</p>
 *       <div class="opts">
 *         <button data-key="a">…</button>
 *         <button data-key="b">…</button>
 *       </div>
 *       <p class="explain">Penjelasan yang muncul setelah menjawab.</p>
 *     </div>
 *   </div>
 *
 * One attempt per question; feedback is immediate. A score line is appended
 * to each .quiz, plus a "Ulangi" button to reset (for spaced retrieval later).
 */
(function () {
  const css = `
  .quiz { margin: 1.2rem 0; }
  .quiz .q { padding: .9rem 0 1rem; border-bottom: 1px solid var(--rule); }
  .quiz .prompt { margin: 0 0 .6rem; }
  .quiz .opts { display: flex; flex-wrap: wrap; gap: .45rem; }
  .quiz button {
    font: inherit; font-size: .9rem; cursor: pointer;
    background: #fff; border: 1px solid var(--ink); padding: .35rem .75rem; text-align: left;
  }
  .quiz .opts.stack { flex-direction: column; }
  .quiz button:hover:not(:disabled) { background: var(--code-bg); }
  .quiz button:disabled { cursor: default; }
  .quiz button.correct { background: var(--ok-bg); border-color: var(--ok); color: var(--ok); }
  .quiz button.wrong { background: var(--bad-bg); border-color: var(--bad); color: var(--bad); text-decoration: line-through; }
  .quiz .explain { display: none; font-size: .9rem; color: var(--muted); margin: .6rem 0 0; }
  .quiz .q.done .explain { display: block; }
  .quiz .verdict { font-family: -apple-system, sans-serif; font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; margin-right: .4rem; }
  .quiz .verdict.ok { color: var(--ok); } .quiz .verdict.no { color: var(--bad); }
  .quiz .score { font-family: -apple-system, sans-serif; font-size: .88rem; margin-top: .8rem; display: flex; gap: 1rem; align-items: center; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll(".quiz").forEach(initQuiz);

  function initQuiz(quiz) {
    const questions = [...quiz.querySelectorAll(".q")];
    const score = document.createElement("div");
    score.className = "score";
    quiz.appendChild(score);

    function render() {
      const done = questions.filter(q => q.classList.contains("done"));
      const right = done.filter(q => q.dataset.result === "ok").length;
      score.innerHTML = `<span>Skor: <strong>${right}/${questions.length}</strong>${done.length < questions.length ? ` · ${questions.length - done.length} tersisa` : ""}</span>`;
      if (done.length === questions.length) {
        const reset = document.createElement("button");
        reset.textContent = "Ulangi";
        reset.onclick = () => { questions.forEach(resetQ); render(); };
        score.appendChild(reset);
      }
    }

    function resetQ(q) {
      q.classList.remove("done");
      delete q.dataset.result;
      q.querySelectorAll(".verdict").forEach(v => v.remove());
      q.querySelectorAll("button").forEach(b => { b.disabled = false; b.classList.remove("correct", "wrong"); });
    }

    questions.forEach(q => {
      q.querySelectorAll(".opts button").forEach(btn => {
        btn.addEventListener("click", () => {
          if (q.classList.contains("done")) return;
          const ok = btn.dataset.key === q.dataset.answer;
          q.dataset.result = ok ? "ok" : "no";
          q.classList.add("done");
          q.querySelectorAll(".opts button").forEach(b => {
            b.disabled = true;
            if (b.dataset.key === q.dataset.answer) b.classList.add("correct");
          });
          if (!ok) btn.classList.add("wrong");
          const v = document.createElement("span");
          v.className = "verdict " + (ok ? "ok" : "no");
          v.textContent = ok ? "Benar" : "Belum tepat";
          q.querySelector(".explain").prepend(v);
          render();
        });
      });
    });
    render();
  }
})();
