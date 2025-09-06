import { describe, it, expect } from "vitest";
import { detectConflicts } from "./TimetableGrid";

const sample = [
  {
    id: "s1",
    title: "A",
    color: "#fff",
    day: "Mon",
    hour: 9,
    duration: 2,
    batch: "b1",
    faculty: "f1",
    room: "r1",
  },
  {
    id: "s2",
    title: "B",
    color: "#fff",
    day: "Mon",
    hour: 10,
    duration: 1,
    batch: "b1",
    faculty: "f2",
    room: "r2",
  },
  {
    id: "s3",
    title: "C",
    color: "#fff",
    day: "Tue",
    hour: 9,
    duration: 1,
    batch: "b2",
    faculty: "f1",
    room: "r1",
  },
];

describe("detectConflicts", () => {
  it("detects overlap and resource conflict", () => {
    const res = detectConflicts(sample as any);
    // s1 (9-11) and s2 (10-11) overlap and share batch -> conflict
    expect(res.has("s1")).toBe(true);
    expect(res.has("s2")).toBe(true);
    expect(res.has("s3")).toBe(false);
  });
});
