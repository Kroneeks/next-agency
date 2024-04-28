import { db } from "@/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();
  const server = await db.query.server.findFirst({
    where: (member, { eq }) => eq(member.profileId, profile[0]["id"]),
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
