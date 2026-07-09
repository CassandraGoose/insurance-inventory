"use server";

import { auth } from "@/lib/auth/server";
import { db } from "./drizzle";
import { category, room_location, item } from "./schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  InventoryItem,
  StandardItem,
  SpecialtyItem,
  type InventoryItemRecord,
} from "@/lib/models/inventory-item";
import { Category } from "@/lib/models/category";
import { RoomLocation } from "@/lib/models/room-location";

function getStandardCategories(categories: (typeof category.$inferSelect)[]) {
  return categories
    .filter((category) => category.coverage_type === "standard")
    .map((category) => category.name);
}

function getSpecialtyCategories(categories: (typeof category.$inferSelect)[]) {
  return categories
    .filter((category) => category.coverage_type === "specialty")
    .map((category) => category.name);
}

async function getAuthUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function getAllCategories() {
  return await db.select().from(category);
}

export async function getUserInventoryItems(): Promise<InventoryItem[]> {
  const user = await getAuthUser();

  const rows = await db
    .select()
    .from(item)
    .innerJoin(category, eq(item.category_id, category.id))
    .innerJoin(room_location, eq(item.room_location, room_location.id))
    .where(eq(item.user_id, user.id));

  const allCategories = await getAllCategories();
  const standardCategories = getStandardCategories(allCategories);
  const specialtyCategories = getSpecialtyCategories(allCategories);

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

export async function updateInventoryItem(
  id: string,
  data: {
    name?: string;
    description?: string;
    brand?: string;
    model?: string;
    identificationNumber?: string;
    purchasePrice: number;
    purchaseDate?: string;
    currentValue?: number;
    coverageType?: "standard" | "specialty";
    categoryId?: string;
    roomLocationId?: string;
  },
): Promise<void> {
  const user = await getAuthUser();

  await db
    .update(item)
    .set({
      name: data.name,
      description: data.description,
      brand: data.brand,
      model: data.model,
      identification_number: data.identificationNumber,
      purchase_price: data.purchasePrice.toString(),
      purchase_date: data.purchaseDate,
      current_value: data.currentValue?.toString(),
      coverage_type: data.coverageType,
      category_id: data.categoryId,
      room_location: data.roomLocationId,
      updated_at: new Date().toISOString().split("T")[0],
    })
    .where(and(eq(item.id, id), eq(item.user_id, user.id)));
}

export async function getItem(id: string): Promise<InventoryItemRecord> {
  const user = await getAuthUser();

  const [row] = await db
    .select()
    .from(item)
    .innerJoin(category, eq(item.category_id, category.id))
    .innerJoin(room_location, eq(item.room_location, room_location.id))
    .where(and(eq(item.user_id, user.id), eq(item.id, id)));

  console.log(row);
  const allCategories = await getAllCategories();

  const standardCategories = getStandardCategories(allCategories);
  const specialtyCategories = getSpecialtyCategories(allCategories);

  if (!row.item.id) throw new Error("No item found!");

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
      row.item.coverage_type === "standard" ? standardCategories : specialtyCategories,
  };
  return record;
}

export async function deleteInventoryItem(formData: FormData) {
  const user = await getAuthUser();
  const id = formData.get("id") as string;
  await db.delete(item).where(and(eq(item.id, id), eq(item.user_id, user.id)));
  revalidatePath("/items");
}

export async function getCategories() {
  return db.select().from(category);
}

export async function getRoomLocations() {
  return db.select().from(room_location);
}
