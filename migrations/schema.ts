import { pgTable, integer, text, boolean, serial, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
});

export const registeredUsers = pgTable("registered_users", {
	id: serial().primaryKey().notNull(),
	slots: integer().array(),
	name: text(),
	age: integer(),
	email: text(),
	phoneNo: text("phone_no"),
	topUpCredit: integer(),
	chakra: text(),
	langUsed: text("lang_used"),
	createdAt: date("created_at").defaultNow().notNull(),
	registrationFees: integer("registration_fees"),
	totalAmt: integer("total_amt"),
	volunteer: text(),
	status: text().default('registered'),
	code: text(),
	sevakaType: text("sevaka_type"),
	sevakaSlots: integer("sevaka_slots").array(),
});
