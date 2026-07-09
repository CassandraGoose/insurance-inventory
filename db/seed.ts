import { db } from "./drizzle";
import { category, room_location } from "./schema";

const categories: { name: string; coverage_type: "standard" | "specialty" }[] = [
  { name: "Furniture", coverage_type: "standard" },
  { name: "Appliances", coverage_type: "standard" },
  { name: "Electronics", coverage_type: "standard" },
  { name: "Clothing", coverage_type: "standard" },
  { name: "Books", coverage_type: "standard" },
  { name: "Music Media", coverage_type: "standard" },
  { name: "Electronic Media", coverage_type: "standard" },
  { name: "Furniture (Designer)", coverage_type: "specialty" },
  { name: "Clothing (Designer)", coverage_type: "specialty" },
  { name: "Musical Instruments", coverage_type: "specialty" },
  { name: "Collectible Cards", coverage_type: "specialty" },
  { name: "Jewelry (Designer)", coverage_type: "specialty" },
  { name: "Fine Art", coverage_type: "specialty" },
  { name: "Books (Collectible)", coverage_type: "specialty" },
  { name: "Vintage Miscellaneous", coverage_type: "specialty" },
  { name: "Collectible Miscellaneous", coverage_type: "specialty" },
];

const room_locations = [
  { name: "Living" },
  { name: "Family" },
  { name: "Bedroom 1" },
  { name: "Bedroom 2" },
  { name: "Bedroom 3" },
  { name: "Bedroom 4" },
  { name: "Bedroom 5" },
  { name: "Bathroom 1" },
  { name: "Bathroom 2" },
  { name: "Bathroom 3" },
  { name: "Hallway (any)" },
  { name: "Unfinished Basement" },
  { name: "Storage" },
  { name: "Garage" },
  { name: "Kitchen" },
  { name: "Dining" },
];

async function seedData() {
  await db.insert(category).values(categories);
  await db.insert(room_location).values(room_locations);
}

seedData();
