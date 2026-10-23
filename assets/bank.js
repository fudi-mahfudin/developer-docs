/*
 * Bank soal bersama (pure logic, tanpa DOM). Lihat assets/README.md untuk format.
 * Bisa dimuat lewat <script> dari file:// (membuat global `QuestionBank`)
 * dan lewat require() di Node untuk test.
 */
(function (root) {
  function createBank() {
    const questions = [];

    function register(list) {
      list.forEach(q => {
        validate(q);
        if (questions.some(e => e.id === q.id)) throw new Error(`Soal ${q.id}: id duplikat`);
        questions.push(q);
      });
    }

    function validate(q) {
      const fail = field => { throw new Error(`Soal ${q.id || "(tanpa id)"}: field "${field}" tidak valid`); };
      ["id", "lesson", "topic", "prompt"].forEach(f => { if (!q[f]) fail(f); });
      if (q.type === "oral") {
        if (!Array.isArray(q.checklist) || q.checklist.length === 0) fail("checklist");
      } else if (q.type === "mc") {
        if (!q.options || Object.keys(q.options).length < 2) fail("options");
        if (!(q.answer in q.options)) fail("answer");
        if (!q.explain) fail("explain");
      } else fail("type");
    }

    function select({ lessons = [], topics = [] } = {}) {
      return questions.filter(q => lessons.includes(q.lesson) || topics.includes(q.topic));
    }

    const topicLabels = {};
    function labelTopics(map) { Object.assign(topicLabels, map); }
    function labels() { return { ...topicLabels }; }

    return { register, select, labelTopics, labels };
  }

  // Deterministic PRNG (mulberry32) so a review can be reproduced from its seed.
  function seededRandom(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng = Math.random) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // Take n questions, one per topic per round, so every topic is hit before any repeats.
  function takeSpread(list, n, rng) {
    const byTopic = new Map();
    shuffle(list, rng).forEach(q => {
      if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
      byTopic.get(q.topic).push(q);
    });
    const groups = shuffle([...byTopic.values()], rng);
    const out = [];
    while (out.length < n && groups.some(g => g.length)) {
      groups.forEach(g => { if (out.length < n && g.length) out.push(g.shift()); });
    }
    return out;
  }

  // Draw a mixed review set: `counts.mc` quiz + `counts.oral` oral questions, shuffled together.
  function draw(pool, counts, rng = Math.random) {
    const mcs = takeSpread(pool.filter(q => q.type === "mc"), counts.mc || 0, rng);
    const orals = takeSpread(pool.filter(q => q.type === "oral"), counts.oral || 0, rng);
    return shuffle(mcs.concat(orals), rng);
  }

  // Spec: lulus lisan = mayoritas poin checklist (4 dari 6) -> at least two thirds.
  function oralPassed(checked, total) {
    return checked >= Math.ceil((total * 2) / 3);
  }

  // results: [{ question, ok }] for mc, [{ question, checked }] for oral.
  // A topic is weak if any of its drawn questions was missed.
  function scoreByTopic(results) {
    const byTopic = new Map();
    results.forEach(r => {
      const q = r.question;
      const right = q.type === "oral" ? oralPassed(r.checked || 0, q.checklist.length) : !!r.ok;
      const s = byTopic.get(q.topic) || { topic: q.topic, right: 0, total: 0 };
      s.total += 1;
      if (right) s.right += 1;
      byTopic.set(q.topic, s);
    });
    return [...byTopic.values()].map(s => ({ ...s, weak: s.right < s.total }));
  }

  // Plain text the user pastes back to the agent.
  function summaryText(scores, { title = "Review", labels = {} } = {}) {
    const name = t => (labels[t] ? `${labels[t]} (${t})` : t);
    const weak = scores.filter(s => s.weak).map(s => s.topic);
    return [
      `Hasil ${title}`,
      ...scores.map(s => `- ${name(s.topic)}: ${s.right}/${s.total}${s.weak ? " LEMAH" : ""}`),
      `Topik lemah: ${weak.length ? weak.join(", ") : "(tidak ada)"}`,
    ].join("\n");
  }

  const api = { createBank, draw, shuffle, seededRandom, oralPassed, scoreByTopic, summaryText };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.QuestionBank = Object.assign(createBank(), api);
})(typeof globalThis !== "undefined" ? globalThis : this);
