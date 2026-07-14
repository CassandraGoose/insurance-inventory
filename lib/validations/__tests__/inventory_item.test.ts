import { describe, it, expect } from "vitest";
import { inventoryItemSchema } from "../inventory-item";

const validData = {
  name: "Laptop",
  purchasePrice: 1200,
  coverageType: "standard",
  categoryId: "550e8400-e29b-41d4-a716-446655440000",
  roomLocationId: "550e8400-e29b-41d4-a716-446655440001",
};

describe("Inventory item validation", () => {
  it("valid data passes validation", () => {
    const result = inventoryItemSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("name shorter than 2 characters fails", () => {
    const result = inventoryItemSchema.safeParse({ ...validData, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("name"))).toBe(true);
    }
  });

  it("negative purchase price fails", () => {
    const result = inventoryItemSchema.safeParse({ ...validData, purchasePrice: -10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("purchasePrice"));
      expect(issue?.message).toContain("positive");
    }
  });

  it("non-UUID categoryId fails", () => {
    const result = inventoryItemSchema.safeParse({ ...validData, categoryId: "not-a-uuid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("categoryId"));
      expect(issue?.message).toContain("Invalid Category");
    }
  });
});
