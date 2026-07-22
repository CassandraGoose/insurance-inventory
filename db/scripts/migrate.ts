import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { readFileSync } from "node:fs";

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = neon(DATABASE_URL);
  const db = drizzle(client);
  
  // couldn't figure out another way to get the migrations to actually run in the pipeline, though they run locally. 
  // unsure of what best practice is. 
   const count = await client`SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations`;
  if (count[0].count === 0) {
    const schemaExists = await client`SELECT EXISTS (
      SELECT 1 FROM information_schema.tables WHERE table_name = 'item'
    ) AS exists`;
    if (schemaExists[0].exists) {
      const journal = JSON.parse(readFileSync("./drizzle/meta/_journal.json", "utf-8"));
      for (const entry of journal.entries) {
        await client`INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
          VALUES (${entry.tag}, ${Date.now()})`;
      }
    }
  }

  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Migration complete");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});