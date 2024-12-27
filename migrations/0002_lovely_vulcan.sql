CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"slot_id" integer,
	"sevaka_type" text,
	"balance" double precision DEFAULT 0,
	"last_transaction" text,
	"status" text NOT NULL,
	"time_in" timestamp,
	"time_out" timestamp,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
