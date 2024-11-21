CREATE TYPE "public"."tracker_model" AS ENUM('H02');

--> statement-breakpoint
CREATE TABLE "user" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "username" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "email_verified" boolean DEFAULT false NOT NULL,
    "password" varchar(255) NOT NULL,
    "reset_password_token" UUID,
    "confirm_email_token" UUID,
    "profile_picture" varchar(255),
    "description" text,
    "organization_id" integer,
    "access_level_id" integer NOT NULL,
    CONSTRAINT "user_username_unique" UNIQUE("username"),
    CONSTRAINT "user_email_unique" UNIQUE("email"),
    CONSTRAINT "user_reset_password_token_unique" UNIQUE("reset_password_token"),
    CONSTRAINT "user_confirm_email_token_unique" UNIQUE("confirm_email_token")
);

--> statement-breakpoint
CREATE TABLE "session" (
    "public_id" serial NOT NULL,
    "session_token" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "expires_at" timestamp(0) with time zone NOT NULL,
    "user_agent" varchar(255) NOT NULL,
    "ip" "inet" NOT NULL,
    "user_id" integer NOT NULL,
    CONSTRAINT "session_public_id_key" UNIQUE("public_id")
);

--> statement-breakpoint
CREATE TABLE "organization" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "name" varchar(255) NOT NULL,
    "blocked" boolean NOT NULL,
    "billing_email" varchar(255) NOT NULL,
    "billing_email_verified" boolean DEFAULT false NOT NULL,
    "confirm_billing_email_token" UUID,
    "owner_id" integer,
    CONSTRAINT "organization_billing_email_unique" UNIQUE("billing_email"),
    CONSTRAINT "organization_owner_id_unique" UNIQUE("owner_id")
);

--> statement-breakpoint
CREATE TABLE "access_level" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" text NOT NULL,
    "is_fixed" boolean NOT NULL,
    "permissions" text [] DEFAULT '{""}' NOT NULL,
    "organization_id" integer
);

--> statement-breakpoint
CREATE TABLE "vehicle" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "plate" varchar(255) NOT NULL,
    "photo" varchar(255),
    "model_year" smallint,
    "fabrication_year" smallint,
    "chassis_number" varchar(255),
    "brand" varchar(255),
    "model" varchar(255),
    "color" varchar(255),
    "additional_info" varchar(255),
    "organization_id" integer NOT NULL,
    CONSTRAINT "vehicle_plate_unique" UNIQUE("plate", "organization_id")
);

--> statement-breakpoint
CREATE TABLE "vehicle_tracker" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "model" "tracker_model" NOT NULL,
    "imei" varchar(255) NOT NULL,
    "organization_id" integer NOT NULL,
    "vehicle_id" integer,
    CONSTRAINT "vehicle_tracker_imei_unique" UNIQUE("imei", "organization_id"),
    CONSTRAINT "vehicle_tracker_vehicle_id_unique" UNIQUE("vehicle_id")
);

--> statement-breakpoint
CREATE TABLE "sim_card" (
    "id" serial PRIMARY KEY NOT NULL,
    "created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
    "phone_number" varchar(255) NOT NULL,
    "ssn" varchar(255) NOT NULL,
    "apn_address" varchar(255) NOT NULL,
    "apn_user" varchar(255) NOT NULL,
    "apn_password" varchar(255) NOT NULL,
    "pin" varchar(8),
    "pin2" varchar(8),
    "puk" varchar(8),
    "puk2" varchar(8),
    "organization_id" integer NOT NULL,
    "vehicle_tracker_id" integer,
    CONSTRAINT "sim_card_phone_number_unique" UNIQUE("phone_number", "organization_id"),
    CONSTRAINT "sim_card_ssn_unique" UNIQUE("ssn", "organization_id")
);

--> statement-breakpoint
CREATE TABLE "vehicle_tracker_last_location" (
    "vehicle_tracker_id" integer PRIMARY KEY NOT NULL,
    "time" timestamp(0) with time zone NOT NULL,
    "point" geometry NOT NULL,
    CONSTRAINT "vehicle_tracker_last_location_vehicle_tracker_id_unique" UNIQUE("vehicle_tracker_id")
);

--> statement-breakpoint
CREATE TABLE "vehicle_tracker_location" (
    "time" timestamp(0) with time zone NOT NULL,
    "vehicle_tracker_id" integer NOT NULL,
    "point" geometry NOT NULL,
    CONSTRAINT "vehicle_tracker_location_pkey" PRIMARY KEY("time", "vehicle_tracker_id")
);

--> statement-breakpoint
ALTER TABLE
    "user"
ADD
    CONSTRAINT "user_access_level_id_foreign" FOREIGN KEY ("access_level_id") REFERENCES "public"."access_level"("id") ON DELETE no action ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "user"
ADD
    CONSTRAINT "user_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "session"
ADD
    CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE
    "organization"
ADD
    CONSTRAINT "organization_owner_id_foreign" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE
set
    null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "access_level"
ADD
    CONSTRAINT "access_level_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE
set
    null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "vehicle"
ADD
    CONSTRAINT "vehicle_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "vehicle_tracker"
ADD
    CONSTRAINT "vehicle_tracker_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "vehicle_tracker"
ADD
    CONSTRAINT "vehicle_tracker_vehicle_id_foreign" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicle"("id") ON DELETE
set
    null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "sim_card"
ADD
    CONSTRAINT "sim_card_organization_id_foreign" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "sim_card"
ADD
    CONSTRAINT "sim_card_vehicle_tracker_id_foreign" FOREIGN KEY ("vehicle_tracker_id") REFERENCES "public"."vehicle_tracker"("id") ON DELETE
set
    null ON UPDATE cascade;

--> statement-breakpoint
ALTER TABLE
    "vehicle_tracker_last_location"
ADD
    CONSTRAINT "vehicle_tracker_last_location_vehicle_tracker_id_foreign" FOREIGN KEY ("vehicle_tracker_id") REFERENCES "public"."vehicle_tracker"("id") ON DELETE cascade ON UPDATE cascade;

--> statement-breakpoint
CREATE INDEX "idx_vehicle_tracker_imei" ON "vehicle_tracker" USING btree ("imei" text_ops);