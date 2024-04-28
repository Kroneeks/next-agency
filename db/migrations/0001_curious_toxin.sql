ALTER TABLE "server" ADD COLUMN "channelId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_channelId_profile_id_fk" FOREIGN KEY ("channelId") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
