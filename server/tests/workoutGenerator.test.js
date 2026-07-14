import test from "node:test";
import assert from "node:assert/strict";
import { buildWorkoutSplit } from "../services/workoutGenerator.js";

test("creates an upper/lower split for two workout days", () => {
  assert.deepEqual(buildWorkoutSplit(2), ["Upper", "Lower"]);
});

test("creates a focused split for five workout days", () => {
  assert.deepEqual(buildWorkoutSplit(5), [
    "Chest Focus",
    "Back Focus",
    "Legs",
    "Shoulders Focus",
    "Arms Focus"
  ]);
});
