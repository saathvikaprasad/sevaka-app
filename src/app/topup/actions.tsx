"use server";
import { db } from "@/db/drizzle";
import { registeredUsers, users, vendors, transactions } from "@/db/schema";
import { supabase } from "@/db/supabase";
import { eq, desc } from "drizzle-orm";

export async function addTransaction(
	qrCode: string,
	amount: number,
	type: string,
	qty2: number = 0,
	qty5: number = 0,
	slug: string
) {
	try {
		const user = await db
			.select({
				id: users.id,
				userId: users.userId,
				sevakaType: users.sevakaType,
				balance: users.balance,
				status: users.status,
			})
			.from(users)
			// .fullJoin(registeredUsers, )
			.where(eq(users.qrcode, qrCode));

		console.log(user);

		if (user.length === 0) {
			throw new Error("User not found");
		}

		if (user[0].status === 2) {
			throw new Error("User has Checked Out");
		}

		if (!user[0].balance || (user[0].balance && user[0].balance < amount)) {
			throw new Error(
				"Insufficient Balance, Current Balance: " + (user[0].balance || 0)
			);
		} else {
			const newBalance = user[0].balance - amount;

			await supabase
				.from("balance")
				.update([
					{
						qrcode: qrCode,
						balance: newBalance,
					},
				])
				.eq("qrcode", qrCode);

			console.log(newBalance);

			const vendor = await db
				.select({
					id: vendors.id,
					balance: vendors.balance,
					onhold: vendors.onhold,
					qty2: vendors.qty2,
					qty5: vendors.qty5,
				})
				.from(vendors)
				.where(eq(vendors.slug, slug));
			console.log(vendor);

			let response_result = {};
			const newQty2 = (vendor[0].qty2 || 0) + qty2;
			const newQty5 = (vendor[0].qty5 || 0) + qty5;

			if (user[0].sevakaType === "S" || user[0].sevakaType === "KS") {
				const newOnhold = (vendor[0].onhold || 0) + amount;

				await db
					.update(vendors)
					.set({ onhold: newOnhold, qty2: newQty2, qty5: newQty5 })
					.where(eq(vendors.slug, slug));
				console.log(newOnhold);
				response_result = {
					onHold: newOnhold,
					balance: vendor[0].balance,
				};
			} else {
				const newVendorBalance = (vendor[0].balance || 0) + amount;
				await db
					.update(vendors)
					.set({ balance: newVendorBalance, qty2: newQty2, qty5: newQty5 })
					.where(eq(vendors.slug, slug));
				console.log(newVendorBalance);
				response_result = {
					onHold: vendor[0].onhold,
					balance: newVendorBalance,
				};
			}

			const transaction = await db
				.insert(transactions)
				.values({
					userId: user[0].id,
					vendorId: vendor[0].id,
					amount: amount,
					status: "success",
					type: type,
					qty2: qty2,
					qty5: qty5,
				})
				.returning({ id: transactions.id });
			console.log(transaction);

			await db
				.update(users)
				.set({ balance: newBalance, lastTransaction: transaction[0].id })
				.where(eq(users.qrcode, qrCode));

			return {
				status: "success",
				data: {
					transaction_id: transaction[0].id,
					response_result,
					newBalance: newBalance,
				},
			};
		}
	} catch (error: any) {
		return { status: "error", data: error.message };
	}
}

export async function getVendorDetails(slug: string) {
	try {
		const vendor = await db
			.select({
				id: vendors.id,
				name: vendors.name,
				chakra: vendors.chakra,
				email: vendors.email,
				onhold: vendors.onhold,
				balance: vendors.balance,
				type: vendors.type,
				qty2: vendors.qty2,
				qty5: vendors.qty5,
			})
			.from(vendors)
			.where(eq(vendors.slug, slug));

		if (vendor.length === 0) {
			throw new Error("Vendor not found");
		}

		return { status: "success", data: vendor[0] };
	} catch (error: any) {
		return { status: "error", data: error.message };
	}
}

export async function getTransactions(stall: number) {
	try {
		const transactionsData = await db
			.select({
				id: transactions.id,
				amount: transactions.amount,
				type: transactions.type,
				status: transactions.status,
				createdAt: transactions.createdAt,
			})
			.from(transactions)
			.where(eq(transactions.vendorId, stall))
			.orderBy(desc(transactions.id));

		return { status: "success", data: transactionsData };
	} catch (error: any) {
		return { status: "error", data: error.message };
	}
}
