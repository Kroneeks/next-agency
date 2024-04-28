import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profileName = await db
    .selectDistinct()
    .from(profile)
    .where(eq(profile.userId, user.id));

  if (profileName.length > 0) {
    return profileName;
  }

  const newProfile = await db.insert(profile).values({
    userId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  });
  return newProfile;
};
