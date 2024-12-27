import {
	integer,
	text,
	boolean,
	pgTable,
	serial,
	date,
	doublePrecision,
	timestamp,
} from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
	id: integer("id").primaryKey(),
	text: text("text").notNull(),
	done: boolean("done").default(false).notNull(),
});

export const registeredUsers = pgTable("registered_users", {
	id: serial("id").primaryKey(),
	slots: integer("slots").array(),
	name: text("name"),
	age: integer("age"),
	email: text("email"),
	phoneNo: text("phone_no"),
	topUpCredit: integer("topUpCredit"),
	chakra: text("chakra"),
	langUsed: text("lang_used"),
	createdAt: date("created_at").defaultNow().notNull(),
	registrationFees: integer("registration_fees"),
	totalAmt: integer("total_amt"),
	volunteer: text("volunteer"),
	status: text("status").default("registered"),
	code: text("code"),
	sevakaType: text("sevaka_type"),
	sevakaSlots: integer("sevaka_slots").array(),
	suraksha: text("suraksha"),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").unique(), // Equivalent to db.Column(db.Integer, primary_key=True)
	name: text("name"), // Equivalent to db.Column(db.String, nullable=False)
	phoneNo: text("phone_no"), // Equivalent to db.Column(db.String, nullable=False)
	slotId: integer("slot_id").notNull(), // Equivalent to db.Column(db.Integer, nullable=True)
	qrcode: text("qrcode").notNull().unique(), // Equivalent to db.Column(db.String(100), nullable=True)
	sevakaType: text("sevaka_type"), // Equivalent to db.Column(db.String, nullable=False)
	balance: doublePrecision("balance").default(0.0), // Equivalent to db.Column(db.Float, default=0.0)
	lastTransaction: integer("last_transaction"), // Equivalent to db.Column(db.String(100), nullable=True)
	status: integer("status").notNull(), // Equivalent to db.Column(db.String(100), nullable=False)
	timeIn: timestamp("time_in"), // Equivalent to db.Column(db.DateTime, nullable=True)
	timeOut: timestamp("time_out"), // Equivalent to db.Column(db.DateTime, nullable=True)
	sevakaAmt: doublePrecision("sevaka_amt").default(0.0), // Equivalent to db.Column(db.Integer, nullable=True)
	plate: text("plate"), // Equivalent to db.Column(db.String(100), nullable=True)
});

export const vendors = pgTable("vendors", {
	id: serial("id").primaryKey(),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	chakra: text("chakra").notNull(),
	email: text("email").notNull(),
	onhold: doublePrecision("onhold").default(0.0),
	balance: doublePrecision("balance").default(0.0),
	qty2: integer("qty2").default(0),
	qty5: integer("qty5").default(0),
	type: text("type").notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
	id: serial("id").primaryKey(),
	vendorId: integer("vendor_id").notNull(),
	userId: integer("user_id").notNull(),
	amount: doublePrecision("amount").notNull(),
	type: text("type").notNull(),
	qty2: integer("qty2").default(0),
	qty5: integer("qty5").default(0),
	status: text("status").notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
});
