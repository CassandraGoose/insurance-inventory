import { describe, it, expect } from "vitest";
import { StandardItem, SpecialtyItem, InventoryItem } from "../inventory-item";
import { Category } from "../category";
import { RoomLocation } from "../room-location";

function makeBase() {
  return {
    id: "1",
    name: "Test Item",
    description: "Description Here",
    brand: "TestBrand",
    model: "TestModel",
    identificationNumber: "0123",
    purchasePrice: 100,
    purchaseDate: null,
    currentValue: null,
    category: new Category("1", "Electronics", "standard-id"),
    roomLocation: new RoomLocation("1", "Living Room"),
    allowedCategories: [],
  };
}

describe("StandardItem", () => {
  it("returns standard coverage explanation", () => {
    const item = new StandardItem({ ...makeBase(), coverageType: "standard" });
    const explanation = item.getCoverageTypeExplanation();
    expect(explanation).toContain("original cost of the item");
  });
});

describe("SpecialtyItem", () => {
  it("returns specialty coverage explanation", () => {
    const item = new SpecialtyItem({ ...makeBase(), coverageType: "specialty", currentValue: 500 });
    const explanation = item.getCoverageTypeExplanation();
    expect(explanation).toContain("proof of the current value");
  });
});

describe("Properties are accessed through setters and getters", () => {
  it("both StandardItem and SpecialtyItem have values that can be viewed and updated", () => {
    const standard = new StandardItem({ ...makeBase(), coverageType: "standard" });
    const specialty = new SpecialtyItem({
      ...makeBase(),
      coverageType: "specialty",
      currentValue: 500,
    });
    // it looks weird, but getters are made in the class and are not callable, so you can treat them as if they are just a property as below:
    expect(standard.brand).toBe("TestBrand");
    standard.setBrand("NewBrand");
    expect(standard.brand).toBe("NewBrand");
    expect(specialty.brand).toBe("TestBrand");
    specialty.setBrand("SpecialBrand");
    expect(specialty.brand).toBe("SpecialBrand");
    expect(standard.name).toBe("Test Item");
    expect(specialty.name).toBe("Test Item");
    expect(standard.category.coverage_type).toBe("standard-id");
    expect(specialty.category.coverage_type).toBe("standard-id");
  });
});

describe("Child classes inherit from parent class", () => {
  it("both StandardItem and SpecialtyItem are instances of InventoryItem", () => {
    const standard = new StandardItem({ ...makeBase(), coverageType: "standard" });
    const specialty = new SpecialtyItem({
      ...makeBase(),
      coverageType: "specialty",
      currentValue: 500,
    });
    expect(standard).toBeInstanceOf(InventoryItem);
    expect(specialty).toBeInstanceOf(InventoryItem);
  });
});
