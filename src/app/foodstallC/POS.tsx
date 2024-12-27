"use client";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { PlusOutlined } from "@ant-design/icons";
import { addTransaction } from "./[stall]/actions";
import { Spin } from "antd";

const POS = ({
	stall,
	stallData,
	transactions,
}: {
	stall: string;
	stallData: any;
	transactions: any;
}) => {
	const TIME_OUT = 15;
	const [QRCodeInput, setQRCodeInput] = useState("");
	const [quantity2, setQuantity2] = useState(0);
	const [quantity5, setQuantity5] = useState(0);
	const [newTransaction, setNewTransaction] = useState(false);
	const [scanStatus, setScanStatus] = useState("pending");
	const [totalSales, setTotalSales] = useState(stallData.balance || 0);
	const [onHold, setOnHold] = useState(stallData.onhold || 0);
	const [items2, setItems2] = useState(stallData.qty2 || 0);
	const [items5, setItems5] = useState(stallData.qty5 || 0);
	const [showTransactions, setShowTransactions] = useState(false);

	const [latestTransactions, setLatestTransactions] =
		useState<any>(transactions);

	// a modal to scan the qr code
	const [scan, setScan] = useState(false);

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
		const total = quantity2 * 2 + quantity5 * 5;

		let response: any = await addTransaction(
			qrCode,
			total,
			"sale",
			quantity2,
			quantity5,
			stall
		);

		console.log(response);

		if (response.status === "success") {
			let data = response.data;
			setScanStatus("success");
			setLatestTransactions((prev: any) => [
				{
					id: data.transaction_id,
					amount: quantity2 * 2 + quantity5 * 5,
					status: "success",
				},
				...prev,
			]);
			setItems2((prev: any) => prev + quantity2);
			setItems5((prev: any) => prev + quantity5);
			setTotalSales(data.response_result.balance);
			setOnHold(data.response_result.onHold);
		} else if (response.status === "error") {
			setScanStatus("pending");
			closeScanner();
			alert(response.data || "Error in transaction! Please try again!");
		}
	};

	const handleError = (err: any) => {
		console.error(err);
		alert("Error! Please try again or try a different Device");
		closeScanner();
	};
	const openScanner = () => {
		setScan(true);
	};
	const closeScanner = () => {
		setScan(false);
	};

	const openNewTransaction = () => {
		setQRCodeInput("");
		setNewTransaction(true);
		setQuantity2(0);
		setQuantity5(0);
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

	const closeTransaction = () => {
		setQRCodeInput("");
		setNewTransaction(false);
		setQuantity2(0);
		setQuantity5(0);
		setScan(false);
		setScanStatus("pending");
	};

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
								Payment Successful !
							</h1>
							<button
								onClick={() => {
									closeScanner();
									closeTransaction();
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
				<h1 className="text-3xl font-bold my-4 mx-2">{stallData.name}</h1>
				{/* <div className="flex w-full items-center justify-center gap-2">
					<button className="w-1/2 bg-gray-800 text-white py-2 px-4 hover:bg-blue-500">
						Call for Assistance
					</button>
					<button
						onClick={logout}
						className="w-full bg-red-700 text-white py-2 px-4 hover:bg-red-900"
					>
						Logout
					</button>
				</div> */}
				{newTransaction ? (
					<>
						<div className="flex flex-col w-full gap-4 mt-4">
							<div className="bg-yellow-300 w-full h-40 flex gap-4 items-center p-4">
								<div className="flex flex-col mx-2 text-yellow-800 items-center">
									<span className="text-6xl">2</span>
									<span className="text-xl">KKD</span>
								</div>
								<div className="flex  flex-1 items-center justify-center p-2 bg-yellow-100 text-yellow-800 rounded-xl h-full ">
									<div className="flex flex-col items-center">
										<span className="text-lg w-full text-center">Quantity</span>
										<span className="text-6xl w-full text-center mx-4">
											{quantity2}
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-4 items-center justify-center">
									<button
										onClick={() => setQuantity2((prev) => prev + 1)}
										className="bg-yellow-700 w-12 text-3xl text-yellow-200 py-1 px-3 hover:bg-yellow-800 rounded"
									>
										+
									</button>
									<button
										onClick={() =>
											setQuantity2((prev) => (prev > 0 ? prev - 1 : 0))
										}
										className="bg-yellow-700 w-12 text-3xl text-yellow-200 py-1 px-3 hover:bg-yellow-800 rounded"
									>
										-
									</button>
								</div>
							</div>
							{stall !== "henna" && (
								<div className="bg-green-300 w-full h-40 flex gap-4 items-center p-4">
									<div className="flex flex-col mx-2 text-green-800 items-center">
										<span className="text-6xl">5</span>
										<span className="text-xl">KKD</span>
									</div>
									<div className="flex  flex-1 items-center justify-center p-2 bg-green-100 text-green-800 rounded-xl h-full ">
										<div className="flex flex-col items-center">
											<span className="text-lg w-full text-center">
												Quantity
											</span>
											<span className="text-6xl w-full text-center mx-4">
												{quantity5}
											</span>
										</div>
									</div>
									<div className="flex flex-col gap-4 items-center justify-center">
										<button
											onClick={() => setQuantity5((prev) => prev + 1)}
											className="bg-green-700 w-12 text-3xl text-green-200 py-1 px-3 hover:bg-green-800 rounded"
										>
											+
										</button>
										<button
											onClick={() =>
												setQuantity5((prev) => (prev > 0 ? prev - 1 : 0))
											}
											className="bg-green-700 w-12 text-3xl text-green-200 py-1 px-3 hover:bg-green-800 rounded"
										>
											-
										</button>
									</div>
								</div>
							)}
						</div>
						<div className="flex w-full gap-4 p-4 mt-6 items-center bg-blue-800">
							<div className="flex-1 flex flex-col text-blue-100 text-4xl">
								<span className="text-xl">Total:</span>
								<span>{quantity2 * 2 + quantity5 * 5} KKD</span>
							</div>
							<div className="flex flex-col gap-2 items-center justify-center">
								<button
									onClick={() => {
										if (quantity2 * 2 + quantity5 * 5 === 0) {
											alert("Please select some items");
										} else {
											openScanner();
										}
									}}
									className="bg-blue-500 w-full text-white py-2 px-4 hover:bg-blue-700 rounded"
								>
									Scan & Pay
								</button>
								<button
									onClick={() => setNewTransaction(false)}
									className="bg-red-500 w-full text-white py-2 px-4 hover:bg-red-700 rounded"
								>
									Cancel
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-col w-full gap-4 mt-4">
						<button
							onClick={() => openNewTransaction()}
							className="flex gap-2 items-center justify-center bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 rounded"
						>
							<PlusOutlined />
							Start New Transaction
						</button>
						<div className="bg-gray-800 shadow-md flex flex-col rounded-lg w-full px-4 py-2 text-orange-200 font-semibold">
							<div className="flex items-center justify-between ">
								<span className="text-xl">Total Sales</span>
								<div className="flex gap-2 items-center">
									<span className="text-5xl">{totalSales}</span>
									<span className="text-xl">KKD</span>
								</div>
							</div>
							<div className="flex items-center justify-end text-sm">
								On Hold : {onHold} KKD
							</div>
						</div>
						<div className="flex flex-row gap-2 w-full items-center justify-between">
							<div
								className={
									"bg-yellow-300 shadow-md rounded-lg flex-col h-50 flex gap-4 items-center py-4 px-2" +
									(stall === "henna" ? " w-full" : " w-1/2")
								}
							>
								<div className="flex mx-2 text-yellow-800 gap-2 items-center">
									<span className="text-5xl">2</span>
									<span className="text-xl font-semibold">KKD</span>
								</div>
								<div className="flex w-full flex-1 items-center justify-center py-2 bg-yellow-100 text-yellow-800 rounded-xl h-full ">
									<div className="flex flex-col items-center">
										<span className="text-5xl w-full text-center mx-4">
											{items2}
										</span>
										<span className="px-2 w-full text-center">Items Sold</span>
									</div>
								</div>
							</div>
							{stall !== "henna" && (
								<div
									className={
										"bg-green-300 shadow-md rounded-lg h-50 w-1/2 flex flex-col gap-4 items-center py-4 px-2" +
										(stall === "henna" ? " w-full" : " w-1/2")
									}
								>
									<div className="flex mx-2 text-green-800 gap-2 items-center">
										<span className="text-5xl">5</span>
										<span className="text-xl font-semibold">KKD</span>
									</div>

									<div className="flex w-full flex-1 items-center justify-center py-2 bg-green-100 text-green-800 rounded-xl h-full ">
										<div className="flex flex-col items-center">
											<span className="text-5xl w-full text-center mx-4">
												{items5}
											</span>
											<span className="px-2 w-full text-center">
												Items Sold
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="flex w-full items-center text-xl font-semibold mx-2 mt-4 justify-between">
							Latest Transactions
						</div>
						{latestTransactions.length === 0 && (
							<div className="flex w-full items-center justify-center italic  text-gray-600 mx-2  ">
								No Transactions
							</div>
						)}

						{!showTransactions ? (
							<>
								{latestTransactions.slice(0, 5).map((transaction: any) => (
									<div
										key={transaction.id}
										className={
											"flex flex-row gap-2 w-full items-center justify-between p-4 rounded-lg  bg-slate-100 shadow-md"
										}
									>
										<div className="flex flex-col ">
											<span className="text-sm font-semibold">
												Transaction ID:{" "}
												{transaction.id.toString().slice(0, -3) + "***"}
											</span>
											<span
												className={
													"text-xs font-semibold px-1 " +
													(transaction.status === "success"
														? "text-green-600"
														: "text-red-600")
												}
											>
												{transaction.status === "success"
													? "Success"
													: "Failed"}
											</span>
										</div>
										<div className="flex gap-2 items-center">
											<span
												className={
													"text-lg font-semibold " +
													(transaction.status === "success"
														? "text-green-600"
														: "text-red-600")
												}
											>
												+ {transaction.amount} KKD
											</span>
										</div>
									</div>
								))}
								<div className="flex w-full items-center justify-center">
									<button
										onClick={() => setShowTransactions(true)}
										className="bg-blue-500 text-white py-2 px-4 rounded"
									>
										Show all
									</button>
								</div>
							</>
						) : (
							latestTransactions.map((transaction: any) => (
								<div
									key={transaction.id}
									className={
										"flex flex-row gap-2 w-full items-center justify-between p-4 rounded-lg  bg-slate-100 shadow-md"
									}
								>
									<div className="flex flex-col ">
										<span className="text-sm font-semibold">
											Transaction ID:{" "}
											{transaction.id.toString().slice(0, -3) + "***"}
										</span>
										<span
											className={
												"text-xs font-semibold px-1 " +
												(transaction.status === "success"
													? "text-green-600"
													: "text-red-600")
											}
										>
											{transaction.status === "success" ? "Success" : "Failed"}
										</span>
									</div>
									<div className="flex gap-2 items-center">
										<span
											className={
												"text-lg font-semibold " +
												(transaction.status === "success"
													? "text-green-600"
													: "text-red-600")
											}
										>
											+ {transaction.amount} KKD
										</span>
									</div>
								</div>
							))
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default POS;
