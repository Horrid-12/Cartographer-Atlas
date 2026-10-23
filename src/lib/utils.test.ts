import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("combines class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting tailwind classes keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });
});
