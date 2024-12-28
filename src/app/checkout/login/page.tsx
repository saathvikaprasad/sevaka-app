import { notFound, redirect } from "next/navigation";
import { stallsData } from "./_utils/stalls";
import Pin from "./Pin";
import { ReactHTMLElement } from "react";

export default async function Page() {
	return (
		<div className="w-full mx-auta">
			<h2 className="text-slate-600 italic text-center my-4">
				Please enter your 4 digit pin
			</h2>
			<Pin />
		</div>
	);
}
