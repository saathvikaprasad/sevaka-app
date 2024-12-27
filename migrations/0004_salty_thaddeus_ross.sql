CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"type" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"chakra" text NOT NULL,
	"email" text NOT NULL,
	"balance" double precision DEFAULT 0,
	"created_at" date DEFAULT now() NOT NULL
);
