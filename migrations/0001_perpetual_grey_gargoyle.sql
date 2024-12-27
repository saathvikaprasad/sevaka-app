CREATE TABLE "registered_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"slots" integer[],
	"name" text,
	"age" integer,
	"email" text,
	"phone_no" text,
	"topUpCredit" integer,
	"chakra" text,
	"lang_used" text,
	"created_at" date DEFAULT now() NOT NULL,
	"registration_fees" integer,
	"total_amt" integer,
	"volunteer" text,
	"status" text DEFAULT 'registered',
	"code" text,
	"sevaka_type" text,
	"sevaka_slots" integer[]
);
