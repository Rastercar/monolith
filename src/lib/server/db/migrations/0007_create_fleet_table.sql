CREATE TABLE IF NOT EXISTS "fleet" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"organization_id" integer
);

--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "fleet_id" integer;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fleet" ADD CONSTRAINT "fleet_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle" ADD CONSTRAINT "user_fleet_id_foreign" FOREIGN KEY ("fleet_id") REFERENCES "public"."fleet"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
