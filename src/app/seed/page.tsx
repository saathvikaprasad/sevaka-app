"use client";
import { seedFromJson } from "./actions";
import React from "react";

const Page = () => {
	return (
		<div>
			Page
			<button onClick={() => seedFromJson()}>Seed</button>
		</div>
	);
};

export default Page;
