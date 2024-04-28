DO $$ BEGIN
 CREATE TYPE "channelType" AS ENUM('TEXT', 'AUDIO', 'VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "memberRole" AS ENUM('ADMIN', 'MODERATOR', 'GUEST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "channelType" DEFAULT 'TEXT' NOT NULL,
	"profileId" uuid,
	"serverId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userRole" "memberRole" DEFAULT 'GUEST' NOT NULL,
	"profileId" uuid,
	"serverId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255),
	"name" varchar(255),
	"imageUrl" varchar(255),
	"email" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"imageUrl" varchar(255),
	"inviteCode" varchar(255),
	"profileId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profileId" ON "channel" ("profileId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "serverId" ON "channel" ("serverId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueName" ON "channel" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueNameAndType" ON "channel" ("name","type");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
