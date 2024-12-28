"use server";
import { db } from "@/db/drizzle";
import { registeredUsers, users, vendors, transactions } from "@/db/schema";
import { supabase } from "@/db/supabase";
import { eq, desc } from "drizzle-orm";

export async function checkOutUser(qrCode: string) {
	try {
		await db
			.update(users)
			.set({ status: 2, timeOut: new Date() })
			.where(eq(users.qrcode, qrCode));

		return { status: "success", data: "User Checked Out" };
	} catch (error: any) {
		console.error(error);
		return { status: "error", data: error.message };
	}
}
