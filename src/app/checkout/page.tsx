import React from "react";
import POS from "./POS";
import { stallsData } from "./login/_utils/stalls";
import { notFound, redirect } from "next/navigation";

import { cookies } from "next/headers";
import { getTransactions, getVendorDetails } from "./actions";

export default async function Page() {
	const cookieStore = await cookies();
	const authToken = cookieStore.get("authToken");

	if (!authToken) {
		redirect(`/topup/login`);
	}

	return (
		<>
			<POS />
		</>
	);
}
