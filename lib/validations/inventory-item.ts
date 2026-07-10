import { z as zod } from "zod";

export const inventoryItemSchema = zod.object({
  name: zod.string().min(2, "Name is required and must be at least two characters long."),
  description: zod.string().nullable().optional(),
  brand: zod.string().nullable().optional(),
  model: zod.string().nullable().optional(),
  identificationNumber: zod.string().nullable().optional(),
  purchasePrice: zod
    .number({ error: "Purchase price is required" })
    .positive("Purchase Price must be positive"),
  purchaseDate: zod
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || new Date(val) <= new Date(), "Purchase Date cannot be in the future"),
  currentValue: zod.number().positive("Current Value must be positive").nullable().optional(),
  coverageType: zod.enum(["standard", "specialty"]),
  categoryId: zod.guid("Invalid Category. Category is required."),
  roomLocationId: zod.guid("Invalid Room Location. Room Location is required"),
});

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;
