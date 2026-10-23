// Run from repo root: node --test
// Pure logic of the shared "susun urutan" exercise (assets/order.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { checkOrder, scramble } = require("../assets/order.js");

const pipeline = ["UseExceptionHandler", "UseRouting", "UseCors", "UseAuthentication", "UseAuthorization", "MapControllers"];

test("checkOrder marks every position and is solved only when all are right", () => {
  assert.deepEqual(checkOrder(pipeline, pipeline), { right: 6, total: 6, solved: true, marks: [true, true, true, true, true, true] });

  const swapped = ["UseExceptionHandler", "UseRouting", "UseCors", "UseAuthorization", "UseAuthentication", "MapControllers"];
  assert.deepEqual(checkOrder(pipeline, swapped), { right: 4, total: 6, solved: false, marks: [true, true, true, false, false, true] });
});

test("scramble keeps every item but never hands back the solved order", () => {
  for (let seed = 0; seed < 50; seed++) {
    let calls = seed;
    const rng = () => ((calls++ * 0.618033) % 1);
    const out = scramble(pipeline, rng);
    assert.deepEqual([...out].sort(), [...pipeline].sort());
    assert.notDeepEqual(out, pipeline);
  }
  // An rng that always yields the identity shuffle must still not return the solved order.
  assert.notDeepEqual(scramble(["a", "b", "c"], () => 0.999), ["a", "b", "c"]);
  assert.deepEqual(scramble(["solo"]), ["solo"]);
});
