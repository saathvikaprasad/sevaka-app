"use server";
import { db } from "@/db/drizzle";
import { registeredUsers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/db/supabase";

export async function getDataFromQR(qrcode: string, slot: number) {
	try {
		const data = await db
			.select({
				id: registeredUsers.id,
				name: registeredUsers.name,
				chakra: registeredUsers.chakra,
				age: registeredUsers.age,
				email: registeredUsers.email,
				slots: registeredUsers.slots,
				topUpCredit: registeredUsers.topUpCredit,
				registrationFees: registeredUsers.registrationFees,
				totalAmt: registeredUsers.totalAmt,
				sevakaType: registeredUsers.sevakaType,

				// Add other columns you need here
			})
			.from(registeredUsers)
			.where(eq(registeredUsers.code, qrcode));

		// filter data where slots contains the slot number in the array
		const filteredData = data.filter((d) => d.slots?.includes(slot));
		return filteredData;
	} catch (error) {
		console.error("Error seeding data:", error);
		return [];
	}
}

export async function getNamesfromChakra(chakra: string) {
	try {
		const data = await db
			.select({
				id: registeredUsers.id,
				name: registeredUsers.name,
			})
			.from(registeredUsers)
			.where(eq(registeredUsers.chakra, chakra));

		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
}

export async function getDataForSlot(slot: number) {
	try {
		const data = await db
			.select({
				id: registeredUsers.id,
				name: registeredUsers.name,
				chakra: registeredUsers.chakra,
				phoneNo: registeredUsers.phoneNo,
				age: registeredUsers.age,
				email: registeredUsers.email,
				slots: registeredUsers.slots,
				topUpCredit: registeredUsers.topUpCredit,
				sevakaType: registeredUsers.sevakaType,
				sevakaSlots: registeredUsers.sevakaSlots,
				registrationFees: registeredUsers.registrationFees,
				totalAmt: registeredUsers.totalAmt,
				code: registeredUsers.code,
				// Add other columns you need here
			})
			.from(registeredUsers);

		// filter data where slots contains the slot number in the array

		return data;
	} catch (error) {
		console.error("Error seeding data:", error);
		return [];
	}
}

const calcCredit = (user: any, slot: number) => {
	if (!user.sevakaType) return user.topUpCredit;
	else if (user.sevakaType === "K") {
		if (user.sevakaSlots.includes(slot)) {
			return user.topUpCredit + user.registrationFees;
		} else if (user.slots.includes(slot)) {
			return user.topUpCredit;
		} else return 0;
	} else if (user.sevakaType === "KS") {
		return user.totalAmt / 2 + 7.5;
	} else if (user.sevakaType === "S") {
		if (user.sevakaSlots.length === 0) return user.totalAmt / 2 + 7.5;
		else if (user.sevakaSlots.includes(slot)) {
			return user.topUpCredit + user.registrationFees + 7.5;
		} else if (user.slots.includes(slot)) {
			return user.topUpCredit;
		} else return 0;
	} else if (user.sevakaType === "C") {
		return user.topUpCredit + user.registrationFees;
	} else if (user.sevakaType === "FS") {
		// if (
		// 	(user.slots.includes(1) || user.slots.includes(2)) &&
		// 	user.slots.includes(3)
		// )
		if (user.sevakaSlots.includes(slot) && user.slots.includes(slot)) {
			return user.topUpCredit + user.registrationFees;
		} else return user.registrationFees / 2 + user.topUpCredit;
	} else return 0;
};

export async function assignWristband(
	code: string,
	slot: number,
	user: any,
	plate: string | null
) {
	// status 1 = checked in
	// status 2 = checked out

	// const modifiedId = `${slot}0${user.id}`;

	let credit = calcCredit(user, slot);

	try {
		const data = await db
			.insert(users)
			.values({
				qrcode: code,
				userId: user.id,
				slotId: slot,
				sevakaType: user.sevakaType || "A",
				balance: credit,
				status: 1,
				name: user.name,
				phoneNo: user.phoneNo,
				timeIn: new Date(),
				plate: plate ? plate : null,
			})
			.returning();

		await supabase.from("balance").insert([
			{
				qrcode: code,
				balance: credit,
			},
		]);

		return { data, status: "success" };
	} catch (error: any) {
		if (
			error.message ===
			`duplicate key value violates unique constraint "users_user_id_unique"`
		) {
			return { status: "error", data: "User already checked in" };
		} else if (
			error.message ===
			`duplicate key value violates unique constraint "users_qrcode_unique"`
		) {
			return { status: "error", data: "QR Code already in use" };
		}
		return { status: "error", data: error.message };
	}
}
