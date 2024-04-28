import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/db";
import { MemberRole, channel, member, server } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channelDataset = await db
      .insert(channel)
      .values({
        name: "general",
        profileId: profile[0].id,
      })
      .returning({ channelId: channel.id });

    const memberDataset = await db
      .insert(member)
      .values({
        profileId: profile[0].id,
        role: MemberRole.enumValues[0],
      })
      .returning({ memberId: member.id });

    const serverDataset = await db.insert(server).values({
      profileId: profile[0].id,
      name,
      imageUrl,
      inviteCode: uuidv4(),
      channelId: channelDataset[0].channelId,
      memberId: memberDataset[0].memberId,
    });

    return NextResponse.json(serverDataset);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
