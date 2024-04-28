ALTER TABLE "server" DROP CONSTRAINT "server_channelId_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "channel" ADD COLUMN "memberId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "channelId";