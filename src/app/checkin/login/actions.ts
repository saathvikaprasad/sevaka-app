"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { stallsData } from "./_utils/stalls";

export async function login(pin: string) {
	//get cookies named AuthToken

	const chakra = stallsData.find((chk) => chk.password === parseInt(pin));
	if (chakra) {
		// redirect to the chakra page
		const cookieStore = await cookies();
		cookieStore.set("authToken", chakra.password.toString(), {
			path: `/`,
			maxAge: 60 * 60 * 12, // Valid for 1 hour
		});

		redirect(`/checkin`);
	} else {
		return "Invalid pin";
	}
}
