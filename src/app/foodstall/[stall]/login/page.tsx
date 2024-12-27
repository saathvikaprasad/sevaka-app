import { notFound, redirect } from "next/navigation";
import { stallsData } from "./_utils/stalls";
import Pin from "./Pin";
import { ReactHTMLElement } from "react";

export default async function Page({
	params,
}: {
	params: Promise<{ stall: string }>;
}) {
	const slug = (await params).stall;
	const chakra = stallsData.find((chakra) => chakra.stall === slug);
	if (chakra === undefined) {
		// Trigger the Not Found error
		notFound();
	}

	return (
		<div className="w-full mx-auta">
			<h1 className="text-xl font-bold text-center my-4">{chakra?.name}</h1>
			<h2 className="text-slate-600 italic text-center my-4">
				Please enter your 4 digit pin
			</h2>
			<Pin />
		</div>
	);
}
