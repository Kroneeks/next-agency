ALTER TABLE "channel" DROP CONSTRAINT "channel_serverId_server_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "serverId";--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "channelId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "channel" DROP COLUMN IF EXISTS "serverId";