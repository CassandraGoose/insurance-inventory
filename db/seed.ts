import { db } from "./drizzle";
import { category } from "./schema";

const categories: { name: string; coverage_type: 'standard' | 'specialty'}[] = [
  { name: "Furniture", coverage_type: 'standard'},
  { name: "Appliances", coverage_type: 'standard'},
  { name: "Electronics", coverage_type: 'standard'},
  { name: "Clothing", coverage_type: 'standard'},
  { name: "Books", coverage_type: 'standard'},
  { name: "Music Media", coverage_type: 'standard'},
  { name: "Electronic Media", coverage_type: 'standard'},
  { name: "Furniture (Designer)", coverage_type: 'specialty' },
  { name: "Clothing (Designer)", coverage_type: 'specialty' },
  { name: "Musical Instruments", coverage_type: 'specialty' },
  { name: "Collectible Cards", coverage_type: 'specialty' },
  { name: "Jewelry (Designer)", coverage_type: 'specialty' },
  { name: "Fine Art", coverage_type: 'specialty' },
  { name: "Books (Collectible)", coverage_type: 'specialty' },
  { name: "Vintage Miscellaneous", coverage_type: 'specialty' },
  { name: "Collectible Miscellaneous", coverage_type: 'specialty' },
];

await db.insert(category).values(categories);
