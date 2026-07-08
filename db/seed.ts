import { db } from "./drizzle";
import { category } from "./schema";

const categories = [
  // Standard
  { name: "Furniture" },
  { name: "Appliances" },
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Books" },
  { name: "Music Media" },
  { name: "Electronic Media" },
  // Specialty
  { name: "Furniture (Designer)" },
  { name: "Clothing (Designer)" },
  { name: "Musical Instruments" },
  { name: "Collectible Cards" },
  { name: "Jewelry (Designer)" },
  { name: "Fine Art" },
  { name: "Books (Collectible)" },
  { name: "Vintage Miscellaneous" },
  { name: "Collectible Miscellaneous" },
];

await db.insert(category).values(categories);
