// OOP style wouldn't typically be utilized in a Next.js app - it's more of a functional-friendly stack.
// However, due to the requirements of the project, I'm including full OOP style class usage
// to demonstrate encapsulation, inheritance, and polymorphism.

import { Category } from "./category";
import { RoomLocation } from "./room-location";

export interface InventoryItemRecord {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  model: string | null;
  identificationNumber: string | null;
  purchasePrice: number;
  purchaseDate: Date | null;
  currentValue?: number | null;
  coverageType: "standard" | "specialty";
  roomLocation: RoomLocation;
  category: Category;
  allowedCategories: string[];
}

export abstract class InventoryItem {
  private _id: string;
  private _name: string;
  private _description: string | null;
  private _brand: string | null;
  private _model: string | null;
  private _identificationNumber: string | null;
  private _purchasePrice: number;
  private _purchaseDate: Date | null;
  private _coverageType: "standard" | "specialty";
  private _roomLocation: RoomLocation;
  private _category: Category;
  private _allowedCategories: string[];

  constructor(data: InventoryItemRecord) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._brand = data.brand;
    this._model = data.model;
    this._identificationNumber = data.identificationNumber;
    this._purchasePrice = Number(data.purchasePrice);
    this._purchaseDate = data.purchaseDate && new Date(data.purchaseDate);

    this._coverageType = data.coverageType;
    this._roomLocation = data.roomLocation;
    this._category = data.category;
    this._allowedCategories = data.allowedCategories;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get brand(): string | null {
    return this._brand;
  }
  get model(): string | null {
    return this._model;
  }
  get identificationNumber(): string | null {
    return this._identificationNumber;
  }
  get purchasePrice(): number {
    return this._purchasePrice;
  }
  get purchaseDate(): Date | null {
    return this._purchaseDate;
  }
  get coverageType(): string {
    return this._coverageType;
  }
  get roomLocation(): RoomLocation | null {
    return this._roomLocation;
  }
  get category(): Category {
    return this._category;
  }
  get allowedCategories(): string[] {
    return this._allowedCategories;
  }

  abstract getCoverageTypeExplanation(): string;
}

export class StandardItem extends InventoryItem {
  getCoverageTypeExplanation(): string {
    return "Coverage will likely include the original cost of the item, not adjusted for inflation or the cost of an equivalent replacement. This may be less than you originally paid.";
  }
}

export class SpecialtyItem extends InventoryItem {
  private _currentValue: number | null;

  constructor(data: InventoryItemRecord) {
    super(data);
    this._currentValue = data.currentValue != null ? Number(data.currentValue) : null;
  }

  get currentValue(): number | null {
    return this._currentValue;
  }

  getCoverageTypeExplanation(): string {
    return "In order for coverage and claims to be accurately calculated, you must be able to provide proof of the current value of the item, dated before the time of coverage. You can do this anytime before making a claim. Valid proof includes images such as: Professional Appraisal Document, Certificate of Authenticity, Reputable Dealer Recently Sold Documents, such as a TCG Player Market Price History Graph Screenshot or a series of recently sold Ebay listings with prices. However, please note that there is no guarantee that the insurance company will honor the provided prices. All claims are dependent on investigations, adjustments, and insurance terms and discretion.";
  }
}
