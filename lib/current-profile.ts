import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profile } from "@/db/schema";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profileDataset = await db
    .selectDistinct()
    .from(profile)
    .where(eq(profile.userId, userId));

  return profileDataset;
};
