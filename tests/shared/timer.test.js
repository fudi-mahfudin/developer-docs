// Run from repo root: node --test
// Pure logic of the shared segmented countdown (assets/timer.js), used by mock interview 0018.
const test = require("node:test");
const assert = require("node:assert/strict");
const { parseSegments, timerState, formatClock } = require("../../assets/timer.js");

const MIN = 60 * 1000;

test("parseSegments reads 'label:minutes' pairs in order", () => {
  assert.deepEqual(parseSegments("Konsep:20, Live coding:25 ,STAR:15"), [
    { label: "Konsep", ms: 20 * MIN },
    { label: "Live coding", ms: 25 * MIN },
    { label: "STAR", ms: 15 * MIN },
  ]);
  assert.throws(() => parseSegments("Konsep:abc"), /Konsep/);
  assert.throws(() => parseSegments(""), /segmen/);
});

test("timerState tells which segment is running and how much of it is left", () => {
  const segs = parseSegments("Konsep:20,Live coding:25,STAR:15");
  assert.deepEqual(timerState(segs, 0), { index: 0, label: "Konsep", remainingMs: 20 * MIN, totalRemainingMs: 60 * MIN, done: false });
  assert.deepEqual(timerState(segs, 5 * MIN), { index: 0, label: "Konsep", remainingMs: 15 * MIN, totalRemainingMs: 55 * MIN, done: false });
  // At the exact boundary the next segment starts with its full time.
  assert.deepEqual(timerState(segs, 20 * MIN), { index: 1, label: "Live coding", remainingMs: 25 * MIN, totalRemainingMs: 40 * MIN, done: false });
  assert.deepEqual(timerState(segs, 50 * MIN), { index: 2, label: "STAR", remainingMs: 10 * MIN, totalRemainingMs: 10 * MIN, done: false });
});

test("timerState is done once the total time has passed, and never goes negative", () => {
  const segs = parseSegments("A:1,B:1");
  assert.deepEqual(timerState(segs, 2 * MIN), { index: 1, label: "B", remainingMs: 0, totalRemainingMs: 0, done: true });
  assert.deepEqual(timerState(segs, 99 * MIN), { index: 1, label: "B", remainingMs: 0, totalRemainingMs: 0, done: true });
});

test("formatClock shows mm:ss and rounds partial seconds up", () => {
  assert.equal(formatClock(20 * MIN), "20:00");
  assert.equal(formatClock(61 * 1000), "01:01");
  assert.equal(formatClock(59001), "01:00");
  assert.equal(formatClock(400), "00:01");
  assert.equal(formatClock(0), "00:00");
  assert.equal(formatClock(-5), "00:00");
});
