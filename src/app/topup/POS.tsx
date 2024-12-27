"use client";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { PlusOutlined } from "@ant-design/icons";
import { addTransaction } from "./actions";
import { Spin } from "antd";

const POS = () => {
	const TIME_OUT = 15;
	const [QRCodeInput, setQRCodeInput] = useState("");
	const [quantity2, setQuantity2] = useState(0);
	const [quantity5, setQuantity5] = useState(0);
	const [newTransaction, setNewTransaction] = useState(false);
	const [scanStatus, setScanStatus] = useState("pending");
	const [newBalance, setNewBalance] = useState(0);

	const [showTransactions, setShowTransactions] = useState(false);
	const [amountGiven, setAmountGiven] = useState<number | string>("");
	const [credit, setCredit] = useState<number | string>("");

	// a modal to scan the qr code
	const [scan, setScan] = useState(false);
	console.log("fds");

	const handleScan = async (data: any) => {
		console.log(data);
		let i = 0;
		for (i = 0; i < data.length; i++) {
			if (data[i].format === "qr_code") {
				await addTransactions(data[i].rawValue);
			}
		}
	};

	const addTransactions = async (qrCode: string) => {
		setScanStatus("scanning");
		console.log("here");

		if ((credit !== "" && amountGiven !== "") || credit !== "") {
			let response: any = await addTransaction(
				qrCode,
				-credit,
				"topup",
				quantity2,
				quantity5,
				"kirtanruci"
			);

			console.log(response);

			if (response.status === "success") {
				let data = response.data;
				setNewBalance(data.newBalance);
				setScanStatus("success");
			} else if (response.status === "error") {
				setScanStatus("pending");
				closeScanner();
				alert(response.data || "Error in transaction! Please try again!");
			}
			setAmountGiven("");
			setCredit("");
		} else alert("Please enter the amount given and credit");
	};

	const handleError = (err: any) => {
		console.error(err);
		alert("Error! Please try again or try a different Device");
		closeScanner();
	};
	const openScanner = () => {
		setScanStatus("pending");
		setScan(true);
	};
	const closeScanner = () => {
		setScan(false);
	};

	// set a timer for 10 seconds to scan the qr code
	const [timer, setTimer] = useState(TIME_OUT);

	const handleTimer = () => {
		setTimer((prev) => {
			if (prev === 1) {
				setScanStatus("failed");
				return 0;
			}
			return prev - 1;
		});
	};

	useEffect(() => {
		if (scan && scanStatus === "pending") {
			const interval = setInterval(handleTimer, 1000);
			const timeout = setTimeout(() => {
				setScanStatus("failed");
				clearInterval(interval);
			}, TIME_OUT * 1000);
			return () => {
				clearInterval(interval);
				clearTimeout(timeout);
			};
		} else {
			setTimer(TIME_OUT);
		}
	}, [scanStatus, scan, timer]);

	return (
		<>
			<div
				className={
					"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" +
					(scan ? "" : " hidden")
				}
			>
				<div className="bg-white p-4 m-4 flex justify-center items-center flex-col rounded-lg w-full max-w-md">
					{scanStatus === "pending" ? (
						<Scanner
							paused={!scan}
							onScan={handleScan}
							onError={handleError}
							styles={{
								container: { width: "100%", height: "100%" },
								video: { width: "100%", height: "100%" },
							}}
							constraints={{ facingMode: "environment" }}
							scanDelay={300}
							components={{
								torch: true,
							}}
						/>
					) : scanStatus === "success" ? (
						<div className="flex flex-col items-center gap-4">
							<h1 className="text-3xl font-bold text-green-600">
								Payment Successful ! New Balance: {newBalance} KKD
							</h1>
							<button
								onClick={() => {
									setScanStatus("pending");
									closeScanner();
								}}
								className="bg-blue-500 text-white py-2 px-4 rounded"
							>
								Close
							</button>
						</div>
					) : scanStatus === "failed" ? (
						<div className="flex flex-col items-center gap-4">
							<h1 className="text-3xl font-bold text-red-600">
								QR Code Scan Failed
							</h1>
							{/* a input that takes whole width and only number can be written with label : Code */}
							<input
								value={QRCodeInput}
								onChange={(e) => setQRCodeInput(e.target.value)}
								placeholder="Enter Code"
								className="w-full p-2 border border-gray-300 rounded"
							/>
							<div className="flex gap-4 w-full items-center justify-center">
								<button
									onClick={async () => {
										await addTransactions(QRCodeInput);
										setScanStatus("success");
									}}
									className="bg-blue-500 text-white py-2 px-4 rounded"
								>
									Pay
								</button>
								<button
									onClick={() => {
										setScanStatus("pending");
									}}
									className="bg-red-500 text-white py-2 px-4 rounded"
								>
									Try Again
								</button>
							</div>
						</div>
					) : scanStatus === "scanning" ? (
						<Spin />
					) : null}
					{scanStatus === "pending" && (
						<div className="justify-between w-full flex items-center">
							<button
								onClick={closeScanner}
								className="bg-red-500 text-white py-2 px-4 mt-4 rounded"
							>
								Close
							</button>
							{/* show remaining time */}
							{/* <span className="text-center text-lg text-gray-800 mt-4">
								{timer} seconds remaining
							</span> */}

							<div className="relative w-8 h-8 mt-4">
								<svg
									className="absolute w-full h-full"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										cx="6"
										cy="6"
										r="5"
										stroke="#D1D5DB"
										strokeWidth="2"
										strokeOpacity="0.25"
										fill="none"
									/>
									<circle
										cx="6"
										cy="6"
										r="5"
										stroke="#2563EB"
										strokeWidth="2"
										strokeDasharray={`${(timer / TIME_OUT) * 2 * Math.PI * 5} ${
											2 * Math.PI * 5
										}`}
										strokeLinecap="round"
										fill="none"
									/>
								</svg>
								<span className="absolute w-full h-full text-sm flex items-center justify-center font-semibold text-blue-800">
									{timer}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col w-full p-2">
				<h1 className="text-3xl font-bold my-4 mx-2">Top Up Counter</h1>

				<div className="flex flex-col w-full gap-4 mt-4">
					<label className="text-xl font-semibold">Amount Given</label>
					<input
						type="number"
						value={amountGiven}
						onChange={(e) => setAmountGiven(parseInt(e.target.value))}
						placeholder="Amount Recieved"
						className="w-full p-2 border border-gray-300 rounded"
					/>
					<label className="text-xl font-semibold">Credit</label>
					<input
						type="number"
						value={credit}
						onChange={(e) => setCredit(parseInt(e.target.value))}
						placeholder="top up Credit"
						className="w-full p-2 border border-gray-300 rounded"
					/>
					<div className="flex w-full gap-4 p-4 mt-6 items-center bg-blue-800">
						<div className="flex-1 flex flex-col text-blue-100 text-4xl">
							<span className="text-xl">Balance:</span>
							<span>
								{(Number(amountGiven) || 0) - (Number(credit) || 0)} KKD
							</span>
						</div>
						<div className="flex flex-col gap-2 items-center justify-center">
							<button
								onClick={() => {
									if ((Number(amountGiven) || 0) - (Number(credit) || 0) < 0) {
										alert("Balance should be 0 or more");
									} else {
										openScanner();
									}
								}}
								className="bg-blue-500 w-full text-white py-2 px-4 hover:bg-blue-700 rounded"
							>
								Scan & Pay
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default POS;
