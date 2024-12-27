import React from "react";
import POS from "../POS";
import { stallsData } from "./login/_utils/stalls";
import { notFound, redirect } from "next/navigation";

import { cookies } from "next/headers";
import { getTransactions, getVendorDetails } from "./actions";

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<{ stall: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const stall = (await params).stall;

	const cookieStore = await cookies();
	const authToken = cookieStore.get("authToken");

	if (!authToken || authToken.value !== btoa(stall)) {
		redirect(`/foodstall/${stall}/login`);
	}

	let data = await getVendorDetails(stall);
	if (!data) {
		return notFound();
	}

	let transactions = await getTransactions(data.data.id);
	if (!transactions) {
		return notFound();
	}

	console.log(transactions);

	return (
		<>
			<POS
				stall={stall}
				stallData={data.data}
				transactions={transactions.data}
			/>
		</>
	);
}
