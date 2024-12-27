"use server";

// read from data.json and using drizzle-orm to insert data into the database

import fs from "fs";
import { db } from "@/db/drizzle";
import { registeredUsers } from "@/db/schema";
import data from "./data.json";

export async function seedFromJson() {
	const mappedRecords: any = data.map((record: any) => ({
		slots: record.slots || [], // Assuming 'slots' is an array
		name: record.name || null, // 'name' column
		age: record.age || null, // 'age' column
		email: record.email || null, // 'email' column
		phoneNo: record.phone_no || null, // 'phone_no' column
		topUpCredit: record.topUpCredit || null, // 'topUpCredit' column
		chakra: record.chakra || null, // 'chakra' column
		langUsed: record.lang_used || null, // 'lang_used' column
		createdAt: record.created_at
			? new Date(record.created_at).toISOString()
			: new Date().toISOString(), // 'created_at' column (ensure it's a string)
		registrationFees: record.registration_fees || null, // 'registration_fees' column
		totalAmt: record.total_amt || null, // 'total_amt' column
		volunteer: record.volunteer || null, // 'volunteer' column
		status: record.status || "registered", // Default 'status' if not provided
		code: record.code || null, // 'code' column
		sevakaType: record.sevaka_type || null, // 'sevaka_type' column
		sevakaSlots: record.sevaka_slots || [], // 'sevaka_slots' column (assuming it's an array)
	}));

	// Insert data into the database
	try {
		await db.insert(registeredUsers).values(mappedRecords); // Ensure `registeredUsers` is a valid table schema
		console.log("Seeding complete!");
	} catch (error) {
		console.error("Error seeding data:", error);
	}
}
