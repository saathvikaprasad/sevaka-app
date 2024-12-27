"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { stallsData } from "./_utils/stalls";

export async function login(slug: string, pin: string) {
	//get cookies named AuthToken

	const chakra = stallsData.find((chakra) => chakra.stall === slug);
	if (chakra === undefined) {
		// Trigger the Not Found error
		notFound();
	}

	if (chakra?.password === parseInt(pin)) {
		// redirect to the chakra page
		const cookieStore = await cookies();
		cookieStore.set("authToken", btoa(slug), {
			path: `/`,
			maxAge: 60 * 60 * 12, // Valid for 1 hour
		});

		redirect(`/foodstall/${slug}`);
	} else {
		return "Invalid pin";
	}
}
