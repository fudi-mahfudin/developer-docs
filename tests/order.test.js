// Run from repo root: node --test
// Pure logic of the shared "susun urutan" exercise (assets/order.js), used by lessons 0005 and 0009.
const test = require("node:test");
const assert = require("node:assert/strict");
const { checkOrder, scramble } = require("../assets/order.js");
const { seededRandom } = require("../assets/bank.js");

const pipeline = ["UseExceptionHandler", "UseRouting", "UseCors", "UseAuthentication", "UseAuthorization", "MapControllers"];

test("checkOrder marks every position and is solved only when all are right", () => {
  assert.deepEqual(checkOrder(pipeline, pipeline), { right: 6, total: 6, solved: true, marks: [true, true, true, true, true, true] });

  const swapped = ["UseExceptionHandler", "UseRouting", "UseCors", "UseAuthorization", "UseAuthentication", "MapControllers"];
  assert.deepEqual(checkOrder(pipeline, swapped), { right: 4, total: 6, solved: false, marks: [true, true, true, false, false, true] });

  assert.deepEqual(checkOrder(["a", "b", "c"], ["b", "a", "c"]), { right: 1, total: 3, solved: false, marks: [false, false, true] });
});

test("scramble keeps every item but never hands back the solved order", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const out = scramble(pipeline, seededRandom(seed));
    assert.deepEqual([...out].sort(), [...pipeline].sort());
    assert.notDeepEqual(out, pipeline, `seed ${seed} menghasilkan urutan yang sudah benar`);
  }
  // An rng that always yields the identity shuffle must still not return the solved order.
  assert.notDeepEqual(scramble(["a", "b", "c"], () => 0.999), ["a", "b", "c"]);
  assert.deepEqual(scramble(["solo"]), ["solo"]);
});

test("scramble does not mutate the input", () => {
  const items = ["a", "b", "c", "d"];
  scramble(items, seededRandom(7));
  assert.deepEqual(items, ["a", "b", "c", "d"]);
});
