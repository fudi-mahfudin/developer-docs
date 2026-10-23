// Run from repo root: node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createBank, draw, seededRandom, oralPassed, scoreByTopic, summaryText,
} = require("../assets/bank.js");

const mc = (id, lesson, topic) => ({
  id, lesson, topic, type: "mc", prompt: "P " + id,
  options: { a: "A", b: "B" }, answer: "a", explain: "E",
});

test("select returns questions from chosen lessons or topics", () => {
  const bank = createBank();
  bank.register([mc("q1", "0001", "layer"), mc("q2", "0002", "csharp-types")]);
  bank.register([mc("q3", "0003", "linq")]);
  const ids = qs => qs.map(q => q.id).sort();
  assert.deepEqual(ids(bank.select({ lessons: ["0001", "0003"] })), ["q1", "q3"]);
  assert.deepEqual(ids(bank.select({ topics: ["csharp-types"] })), ["q2"]);
  assert.deepEqual(ids(bank.select({ lessons: ["0001"], topics: ["linq"] })), ["q1", "q3"]);
});

test("register rejects questions that break the bank format", () => {
  const bank = createBank();
  const { explain, ...noExplain } = mc("x1", "0001", "layer");
  assert.throws(() => bank.register([noExplain]), /x1.*explain/);
  assert.throws(() => bank.register([{ ...mc("x2", "0001", "layer"), answer: "z" }]), /x2.*answer/);
  assert.throws(() => bank.register([{ id: "o1", lesson: "0001", topic: "layer", type: "oral", prompt: "P" }]), /o1.*checklist/);
  bank.register([mc("dup", "0001", "layer")]);
  assert.throws(() => bank.register([mc("dup", "0002", "layer")]), /dup.*duplikat/);
});

const oral = (id, lesson, topic) => ({
  id, lesson, topic, type: "oral", prompt: "Jelaskan " + id, checklist: ["a", "b", "c"],
});

const pool = [
  mc("a1", "0001", "A"), mc("a2", "0001", "A"), mc("a3", "0001", "A"), mc("a4", "0001", "A"),
  mc("b1", "0002", "B"), mc("c1", "0003", "C"),
  oral("o1", "0001", "A"), oral("o2", "0002", "B"),
];

test("draw takes the requested mc and oral counts without repeats", () => {
  const got = draw(pool, { mc: 4, oral: 1 }, seededRandom(1));
  assert.equal(got.filter(q => q.type === "mc").length, 4);
  assert.equal(got.filter(q => q.type === "oral").length, 1);
  assert.equal(new Set(got.map(q => q.id)).size, 5);
});

test("draw covers every topic before repeating one", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const topics = draw(pool, { mc: 3, oral: 0 }, seededRandom(seed)).map(q => q.topic).sort();
    assert.deepEqual(topics, ["A", "B", "C"]);
  }
});

test("draw is reproducible per seed and mixes oral between mc", () => {
  const seeds = [1, 2, 3, 4, 5, 6, 7, 8];
  const ids = seed => draw(pool, { mc: 6, oral: 2 }, seededRandom(seed)).map(q => q.id);
  assert.deepEqual(ids(7), ids(7));
  assert.ok(new Set(seeds.map(s => ids(s).join())).size > 1, "different seeds should give different orders");
  const oralNotAtEnd = seeds.some(s => {
    const types = draw(pool, { mc: 6, oral: 2 }, seededRandom(s)).map(q => q.type);
    return types.indexOf("oral") < types.lastIndexOf("mc");
  });
  assert.ok(oralNotAtEnd, "oral questions should be interleaved, not appended");
});

test("oral answer passes with a majority of checklist points (4 of 6)", () => {
  assert.equal(oralPassed(4, 6), true);
  assert.equal(oralPassed(3, 6), false);
  assert.equal(oralPassed(2, 3), true);
  assert.equal(oralPassed(1, 3), false);
});

test("scoreByTopic counts right answers per topic, oral judged by checklist", () => {
  const six = { ...oral("o6", "0001", "A"), checklist: ["1", "2", "3", "4", "5", "6"] };
  const results = [
    { question: mc("a1", "0001", "A"), ok: true },
    { question: mc("b1", "0002", "B"), ok: false },
    { question: six, checked: 5 },
    { question: mc("c1", "0003", "C"), ok: true },
    { question: oral("o2", "0002", "B"), checked: 3 },
  ];
  assert.deepEqual(scoreByTopic(results), [
    { topic: "A", right: 2, total: 2, weak: false, status: "Lulus" },
    { topic: "B", right: 1, total: 2, weak: true, status: "Lemah" },
    { topic: "C", right: 1, total: 1, weak: false, status: "Kuis lulus, lisan belum diuji" },
  ]);
});

test("summaryText lists every topic score and the weak topics for the agent", () => {
  const scores = [
    { topic: "layer", right: 2, total: 2, weak: false },
    { topic: "di-lifetime", right: 1, total: 3, weak: true },
  ];
  const text = summaryText(scores, { title: "Review 0007", labels: { "di-lifetime": "Service Lifetime" } });
  assert.equal(text, [
    "Hasil Review 0007",
    "- layer: 2/2",
    "- Service Lifetime (di-lifetime): 1/3 LEMAH",
    "Topik lemah: di-lifetime",
  ].join("\n"));
  const allGood = summaryText([scores[0]], { title: "Review 0007" });
  assert.match(allGood, /Topik lemah: \(tidak ada\)$/);
});

test("topic labels registered by different lesson files are merged", () => {
  const bank = createBank();
  bank.labelTopics({ layer: "Layer & alur request" });
  bank.labelTopics({ linq: "LINQ" });
  assert.deepEqual(bank.labels(), { layer: "Layer & alur request", linq: "LINQ" });
});

test("draw returns what is available when asking for more than the pool", () => {
  assert.equal(draw(pool, { mc: 50, oral: 50 }, seededRandom(3)).length, pool.length);
});

test("a topic only passes when its oral was tested too; quiz-only passes are marked separately", () => {
  const six = { ...oral("o6", "0001", "A"), checklist: ["1", "2", "3", "4", "5", "6"] };
  const scores = scoreByTopic([
    { question: mc("a1", "0001", "A"), ok: true },
    { question: six, checked: 4 },
    { question: mc("c1", "0003", "C"), ok: true },
    { question: mc("b1", "0002", "B"), ok: false },
  ]);
  assert.deepEqual(scores.map(s => [s.topic, s.status]), [
    ["A", "Lulus"],
    ["C", "Kuis lulus, lisan belum diuji"],
    ["B", "Lemah"],
  ]);
  const text = summaryText(scores, { title: "Review 0007" });
  assert.equal(text, [
    "Hasil Review 0007",
    "- A: 2/2",
    "- C: 1/1 KUIS LULUS, LISAN BELUM DIUJI",
    "- B: 0/1 LEMAH",
    "Topik lemah: B",
    "Kuis lulus, lisan belum diuji: C",
  ].join("\n"));
});
