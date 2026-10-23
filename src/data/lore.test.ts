import { describe, expect, it } from "vitest";
import { SECTOR_METAS } from "./lore";
import { MISSIONS } from "../lib/game";

describe("SECTOR_METAS", () => {
  it("has exactly 6 sector definitions matching MISSIONS length", () => {
    expect(SECTOR_METAS).toHaveLength(6);
    expect(SECTOR_METAS).toHaveLength(MISSIONS.length);
  });

  it("maps id and index to the corresponding mission", () => {
    SECTOR_METAS.forEach((meta, idx) => {
      expect(meta.index).toBe(idx);
      expect(meta.id).toBe(MISSIONS[idx].id);
      expect(meta.roman).toBe(["I", "II", "III", "IV", "V", "VI"][idx]);
    });
  });

  it("provides valid coordinate and docket strings", () => {
    SECTOR_METAS.forEach((meta) => {
      expect(meta.coords).toMatch(/\d+°\d+'\d+" [NSEW] • \d+°\d+'\d+" [NSEW]/);
      expect(meta.docket).toMatch(/^C-1887-[IVXLCDM]+$/);
      expect(meta.lore.length).toBeGreaterThan(20);
      expect(meta.mapX).toBeGreaterThanOrEqual(0);
      expect(meta.mapX).toBeLessThanOrEqual(100);
      expect(meta.mapY).toBeGreaterThanOrEqual(0);
      expect(meta.mapY).toBeLessThanOrEqual(100);
    });
  });
});
