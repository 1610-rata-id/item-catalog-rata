import { describe, expect, it } from "vitest";
import { transformNumber } from "../../etl/transform/number";

describe("transformNumber", () => {
  it("should convert '2,000' to 2000", () => {
    expect(transformNumber("2,000")).toBe(2000);
  });

  it("should convert '15' to 15", () => {
    expect(transformNumber("15")).toBe(15);
  });

  it("should return null for empty string", () => {
    expect(transformNumber("")).toBeNull();
  });

  it("should return null for undefined", () => {
    expect(transformNumber(undefined)).toBeNull();
  });

  it("should return null for invalid value", () => {
    expect(transformNumber("ABC")).toBeNull();
  });
});