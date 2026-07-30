import { describe, expect, it } from "vitest";
import { transformCurrency } from "../../etl/transform/currency";

describe("transformCurrency", () => {
  it("should convert 'Rp 3,500' to 3500", () => {
    expect(transformCurrency("Rp 3,500")).toBe(3500);
  });

  it("should convert 'Rp30,000' to 30000", () => {
    expect(transformCurrency("Rp30,000")).toBe(30000);
  });

  it("should convert '3,500' to 3500", () => {
    expect(transformCurrency("3,500")).toBe(3500);
  });

  it("should return null for empty string", () => {
    expect(transformCurrency("")).toBeNull();
  });

  it("should return null for undefined", () => {
    expect(transformCurrency(undefined)).toBeNull();
  });

  it("should return null for invalid value", () => {
    expect(transformCurrency("ABC")).toBeNull();
  });
});