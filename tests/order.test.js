// Run from repo root: node --test
// Pure logic of the step-ordering drill (assets/order.js).
const test = require("node:test");
const assert = require("node:assert/strict");
const { scramble, checkOrder } = require("../assets/order.js");
const { seededRandom } = require("../assets/bank.js");

test("scramble returns every step index exactly once and never the solved order", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const order = scramble(5, seededRandom(seed));
    assert.deepEqual(order.slice().sort(), [0, 1, 2, 3, 4]);
    assert.notDeepEqual(order, [0, 1, 2, 3, 4], `seed ${seed} menghasilkan urutan yang sudah benar`);
  }
});

test("checkOrder marks each picked position and reports a full solve", () => {
  assert.deepEqual(checkOrder([0, 1, 2]), { marks: [true, true, true], right: 3, solved: true });
  assert.deepEqual(checkOrder([1, 0, 2]), { marks: [false, false, true], right: 1, solved: false });
});
