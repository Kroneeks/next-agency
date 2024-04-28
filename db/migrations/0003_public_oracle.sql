ALTER TABLE "member" DROP CONSTRAINT "member_serverId_server_id_fk";
--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "memberId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN IF EXISTS "serverId";