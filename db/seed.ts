import { db } from "./drizzle";
import { category, room_location, coverage_type } from "./schema";

const coverageTypes = [{ name: "standard" }, { name: "specialty" }];

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
  const insertedCoverageTypes = await db.insert(coverage_type).values(coverageTypes).onConflictDoUpdate({
    target: coverage_type.name,
    set: {
      name: coverage_type.name,
    },
  })
  .returning();
  
  const standardId = insertedCoverageTypes.find((t) => t.name === "standard")!.id;
  const specialtyId = insertedCoverageTypes.find((t) => t.name === "specialty")!.id;

  const categoryData = [
    { name: "Furniture", coverage_type_id: standardId },
    { name: "Appliances", coverage_type_id: standardId },
    { name: "Electronics", coverage_type_id: standardId },
    { name: "Clothing", coverage_type_id: standardId },
    { name: "Books", coverage_type_id: standardId },
    { name: "Music Media", coverage_type_id: standardId },
    { name: "Electronic Media", coverage_type_id: standardId },
    { name: "Furniture (Designer)", coverage_type_id: specialtyId },
    { name: "Clothing (Designer)", coverage_type_id: specialtyId },
    { name: "Musical Instruments", coverage_type_id: specialtyId },
    { name: "Collectible Cards", coverage_type_id: specialtyId },
    { name: "Jewelry (Designer)", coverage_type_id: specialtyId },
    { name: "Fine Art", coverage_type_id: specialtyId },
    { name: "Books (Collectible)", coverage_type_id: specialtyId },
    { name: "Vintage Miscellaneous", coverage_type_id: specialtyId },
    { name: "Collectible Miscellaneous", coverage_type_id: specialtyId },
  ];

  await db.insert(category).values(categoryData).onConflictDoNothing();
  await db.insert(room_location).values(room_locations).onConflictDoNothing();
}

seedData();
