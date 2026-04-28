CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."atmosphere" AS ENUM('busy', 'quiet');--> statement-breakpoint
CREATE TYPE "public"."crowdedness" AS ENUM('low', 'high');--> statement-breakpoint
CREATE TYPE "public"."mood" AS ENUM('relaxed', 'focused');--> statement-breakpoint
CREATE TYPE "public"."spot_type" AS ENUM('indoor', 'outdoor');--> statement-breakpoint
CREATE TYPE "public"."visit_type" AS ENUM('group', 'alone');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"facilities" text,
	"spot_type" "spot_type" NOT NULL,
	"crowdedness" "crowdedness" NOT NULL,
	"atmosphere" "atmosphere" NOT NULL,
	"visit_type" "visit_type" NOT NULL,
	"mood" "mood" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
