CREATE TYPE "public"."coverage_type" AS ENUM('standard', 'specialty');--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"room_location_id" uuid,
	"coverage_type" "coverage_type" DEFAULT 'standard' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"brand" varchar(255),
	"model" varchar(255),
	"identification_number" varchar(100),
	"purchase_price" numeric(10, 2) NOT NULL,
	"purchase_date" date,
	"current_value" numeric(10, 2),
	"created_at" date DEFAULT now(),
	"updated_at" date
);
--> statement-breakpoint
CREATE TABLE "room_location" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_room_location_id_room_location_id_fk" FOREIGN KEY ("room_location_id") REFERENCES "public"."room_location"("id") ON DELETE cascade ON UPDATE no action;