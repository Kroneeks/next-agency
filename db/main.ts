import "dotenv/config";
import { db } from ".";
import { UserPreferencesTable } from "./schema";

async function main() {
  await db.insert(UserPreferencesTable).values({
    emailUpdates: true,
    userId: "36ddea95-c2a4-4257-b078-da011263b1f3",
  });

  const users = await db.query.UserTable.findMany({
    columns: { name: true, id: true },
    with: {
      posts: { with: { postCategories: true } },
    },
  });

  console.log(users);
}

main();
