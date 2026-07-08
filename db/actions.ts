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
      category: new Category(row.category.id, row.category.name),
      roomLocation: new RoomLocation(row.room_location.id, row.room_location.name),
    };
    return record.coverageType === "specialty"
      ? new SpecialtyItem(record)
      : new StandardItem(record);
  });
}
