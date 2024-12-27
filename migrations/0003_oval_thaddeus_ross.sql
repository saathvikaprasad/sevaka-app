ALTER TABLE "users" ALTER COLUMN "slot_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_transaction" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "qrcode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sevaka_amt" double precision DEFAULT 0;