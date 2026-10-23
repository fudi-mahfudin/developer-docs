/*
 * Mengisi <div class="quiz" data-bank-lesson="0001"> dengan soal kuis (type "mc") dari bank,
 * dalam urutan registrasi, memakai markup quiz.js. Dengan begitu soal lesson ditulis sekali
 * (di assets/questions/NNNN.js) dan dipakai ulang oleh review.
 *
 * Atribut opsional: data-bank-topic="layer" (filter topik), data-stack (opsi ditumpuk vertikal).
 * Urutan script: bank.js -> questions/NNNN.js -> bank-quiz.js -> quiz.js
 */
(function () {
  const QB = window.QuestionBank;
  document.querySelectorAll(".quiz[data-bank-lesson]").forEach(el => {
    const topic = el.dataset.bankTopic;
    const qs = QB.select({ lessons: [el.dataset.bankLesson] })
      .filter(q => q.type === "mc" && (!topic || q.topic === topic));
    el.innerHTML = qs.map(q => `
      <div class="q" data-answer="${q.answer}">
        <p class="prompt">${q.prompt}</p>
        <div class="opts${el.hasAttribute("data-stack") ? " stack" : ""}">${Object.keys(q.options)
          .map(k => `<button data-key="${k}">${q.options[k]}</button>`).join("")}</div>
        <p class="explain">${q.explain}</p>
      </div>`).join("");
  });
})();
