"use client";

import { useParams } from "next/navigation";
import { login } from "./actions";
import { useEffect, useState } from "react";

const Pin = () => {
	// a form that takes a 4 digit pin and verifies it
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const slug = useParams().stall as string;

	const handleSubmit = async (pin: string) => {
		if (pin) {
			setLoading(true);
			let message = await login(pin.toString());
			if (message === "Invalid pin") {
				setError("Invalid pin.");
				setLoading(false);
			}
		}
	};

	// on page load, the user is presented with a form to enter a 4 digit pin
	// focus is set on the first input field
	useEffect(() => {
		const firstInput = document.querySelector(
			'input[name="pin-0"]'
		) as HTMLInputElement;
		if (firstInput) {
			firstInput.focus();
			firstInput.click();
		}
	}, []);

	return (
		<div className="w-full mx-auto">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const form = e.target as HTMLFormElement;
					const pin = Array.from(form.elements)
						.filter(
							(el) =>
								el instanceof HTMLInputElement && el.name.startsWith("pin-")
						)
						.map((el) => (el as HTMLInputElement).value)
						.join("");
					if (pin.length === 4) {
						handleSubmit(pin);
					}
				}}
				className="flex flex-col gap-2 justify-center items-center"
			>
				<div className="flex gap-2">
					{[0, 1, 2, 3].map((index) => (
						<input
							key={index}
							name={`pin-${index}`}
							autoComplete="off"
							maxLength={1}
							type="number"
							pattern="[0-9]*"
							className="border border-gray-300 rounded-md p-2 text-center w-12"
							onInput={(e) => {
								const target = e.target as HTMLInputElement;
								if (target.value.length === 1 && target.nextElementSibling) {
									(target.nextElementSibling as HTMLInputElement).focus();
								}
								const form = target.form;
								if (form) {
									const pin = Array.from(form.elements)
										.filter(
											(el) =>
												el instanceof HTMLInputElement &&
												el.name.startsWith("pin-")
										)
										.map((el) => (el as HTMLInputElement).value)
										.join("");
									if (pin.length === 4) {
										handleSubmit(pin);
									}
								}
							}}
							onKeyDown={(e) => {
								const target = e.target as HTMLInputElement;
								if (e.key === "Backspace") {
									if (
										target.value.length === 0 &&
										target.previousElementSibling
									) {
										(target.previousElementSibling as HTMLInputElement).focus();
									}
								}
							}}
						/>
					))}
				</div>
				{error && <p className="text-red-500">{error}</p>}
				<button
					className="bg-slate-900 text-white mt-4 py-2 px-6 rounded-md flex items-center justify-center gap-2"
					type="submit"
					disabled={loading}
				>
					Login
					{loading && (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
					)}
				</button>
			</form>
		</div>
	);
};

export default Pin;
