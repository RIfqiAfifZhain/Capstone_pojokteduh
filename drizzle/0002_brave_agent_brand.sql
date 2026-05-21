CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"spot_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"target_spot" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "operational_hours" text;--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "latitude" numeric(10, 8);--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "longitude" numeric(11, 8);--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_spot_id_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_target_spot_spots_id_fk" FOREIGN KEY ("target_spot") REFERENCES "public"."spots"("id") ON DELETE set null ON UPDATE no action;