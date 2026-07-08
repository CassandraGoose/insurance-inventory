"use server";

import { auth } from "@/lib/auth/server";
import { db } from "./drizzle";
import { category, room_location, item } from "./schema";
import { eq } from "drizzle-orm";
import {
  InventoryItem,
  StandardItem,
  SpecialtyItem,
  type InventoryItemRecord,
} from "@/lib/models/inventory-item";
import { Category } from "@/lib/models/category";
import { RoomLocation } from "@/lib/models/room-location";

async function getAuthUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function getUserInventoryItems(): Promise<InventoryItem[]> {
  const user = await getAuthUser();

  const rows = await db
    .select()
    .from(item)
    .innerJoin(category, eq(item.category_id, category.id))
    .innerJoin(room_location, eq(item.room_location, room_location.id))
    .where(eq(item.user_id, user.id));

  const allCategories = await db.select().from(category);
  const standardCategories = allCategories
    .filter((c) => c.coverage_type === "standard")
    .map((c) => c.name);

  const specialtyCategories = allCategories
    .filter((c) => c.coverage_type === "specialty")
    .map((c) => c.name);

  return rows.map((row) => {
    const record: InventoryItemRecord = {
      id: row.item.id,
      name: row.item.name,
      description: row.item.description,
      brand: row.item.brand,
      model: row.item.model,
      identificationNumber: row.item.identification_number,
      purchasePrice: Number(row.item.purchase_price),
      purchaseDate: row.item.purchase_date ? new Date(row.item.purchase_date) : null,
      currentValue: row.item.current_value ? Number(row.item.current_value) : null,
      coverageType: row.item.coverage_type,
      category: new Category(row.category.id, row.category.name, row.category.coverage_type),
      roomLocation: new RoomLocation(row.room_location.id, row.room_location.name),
      allowedCategories:
        row.category.coverage_type === "standard" ? standardCategories : specialtyCategories,
    };
    return record.coverageType === "specialty"
      ? new SpecialtyItem(record)
      : new StandardItem(record);
  });
}

export async function createInventoryItem(data: {
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  identificationNumber?: string;
  purchasePrice: number;
  purchaseDate?: string;
  currentValue?: number;
  coverageType: "standard" | "specialty";
  categoryId: string;
  roomLocationId: string;
}): Promise<void> {
  const user = await getAuthUser();

  await db.insert(item).values({
    id: crypto.randomUUID(),
    user_id: user.id,
    room_location: data.roomLocationId,
    coverage_type: data.coverageType,
    name: data.name,
    category_id: data.categoryId,
    description: data.description ?? null,
    brand: data.brand ?? null,
    model: data.model ?? null,
    identification_number: data.identificationNumber ?? null,
    purchase_price: data.purchasePrice.toString(),
    purchase_date: data.purchaseDate ?? null,
    current_value: data.currentValue?.toString() ?? null,
  });
}

export async function getCategories() {
  return db.select().from(category);
}

export async function getRoomLocations() {
  return db.select().from(room_location);
}
