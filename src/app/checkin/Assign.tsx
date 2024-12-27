"use client";
import {
	CarFilled,
	DoubleRightOutlined,
	LeftOutlined,
	LogoutOutlined,
	QrcodeOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Divider, Select, Spin } from "antd";
import { FC, use, useEffect, useState } from "react";
import { assignWristband, getDataFromQR, getNamesfromChakra } from "./actions";

type props = {
	filterDataInSlot: any;
	filterDataNotInSlot: any;
	slot: number;
};

const Assign: FC<props> = ({ filterDataInSlot, filterDataNotInSlot, slot }) => {
	const TIME_OUT = 15;
	const sevaka_classes: any = {
		K: "Kirtaniya",
		KS: "Kirtaniya / Sevaka",
		S: "Sevaka",
		C: "Support",
		FS: "Stall Sevaka",
	};

	const [scan, setScan] = useState(false);
	const [scanStatus, setScanStatus] = useState("pending");
	const [registered, setRegistered] = useState<any>(null);
	const [readData, setReadData] = useState<string | null>(null);
	const [qrmode, setQRMode] = useState("email");
	const [assigningID, setAssigningID] = useState<any>(null);
	const [qrLoading, setQrlLoading] = useState(false);
	const [chakra, setChakra] = useState("");
	const [names, setNames] = useState<any>([]);
	const [namesLoading, setNamesLoading] = useState(false);
	const [filteredME, setFilteredME] = useState<number>(0);
	const [filteredName, setFilteredName] = useState<number | null>(null);
	const [plate, setPlate] = useState<string | null>(null);

	const chakras =
		"Jagannath Puri, Ram keli, Simantha, Kola, Sri Kashi Dham, Ekachakra, Godruma, Sri Adi Kesava Dham, Ritu, Mamgachi, Modadruma, Pundarik Dham, Ayodhya, Guruvayoor Dham, Keturi Dham, Srivas Angan, Rudra, Antar dwip, Radhakund, Nawadwip, Badrika Ashram, Sri Ranga Dham Chakra, Nilachal, Prayag, Ahobilam, Madhya, Govardhan Giri, Gupta Gokul dham, Janu Dwip, Ananta Padmanaba, Sri Punarthirtha Dham";
	const chakraList = chakras.split(", ");

	const openScannerforWB = (user: any) => {
		setQRMode("wb");
		setScanStatus("pending");
		setScan(true);
		setAssigningID(user);
	};

	const openScannerforEmail = () => {
		setQRMode("email");
		setScanStatus("pending");
		setScan(true);
	};
	const closeScanner = () => {
		setScanStatus("pending");
		setScan(false);
	};

	const handleScan = async (data: any) => {
		if (qrmode === "email") {
			let i = 0;
			for (i = 0; i < data.length; i++) {
				if (data[i].format === "qr_code") {
					setQrlLoading(true);
					let qrCode = data[i].rawValue;
					console.log(qrCode);
					let reg_data = [...filterDataInSlot, ...filterDataNotInSlot].filter(
						(user: any) => user.code === qrCode
					);
					setRegistered(reg_data);
					closeScanner();
					setQrlLoading(false);
				}
			}
		} else if (qrmode === "wb") {
			let i = 0;
			for (i = 0; i < data.length; i++) {
				if (data[i].format === "qr_code") {
					setQrlLoading(true);
					let qrCode = data[i].rawValue;
					let response = await assignWristband(
						qrCode,
						slot,
						assigningID,
						plate
					);
					setQrlLoading(false);

					if (response?.status === "success") {
						closeScanner();
						alert("Wristband assigned successfully");
					} else {
						if (response?.status === "error") {
							closeScanner();
							alert(response?.data || "Error! Network Error");
						}
					}
				}
			}
		}
	};

	const handleError = (err: any) => {
		console.error(err);
		alert("Error! Please try again or try a different Device");
		closeScanner();
	};

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

	const filterWithME = () => {
		if (filteredME !== 0) {
			let filtered_email = [...filterDataInSlot, ...filterDataNotInSlot].find(
				(user: any) => user.id === filteredME
			).email;
			let reg_data = [...filterDataInSlot, ...filterDataNotInSlot].filter(
				(user: any) =>
					user.email.trim().toLowerCase() ===
					filtered_email.trim().toLowerCase()
			);
			setRegistered(reg_data);
		}
	};

	const filterWithName = () => {
		if (filteredName) {
			let filtered_email = [...filterDataInSlot, ...filterDataNotInSlot].find(
				(user: any) => user.id === filteredName
			).email;
			let reg_data = [...filterDataInSlot, ...filterDataNotInSlot].filter(
				(user: any) =>
					user.email.trim().toLowerCase() ===
					filtered_email.trim().toLowerCase()
			);
			setRegistered(reg_data);
			console.log(reg_data);
		}
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

	useEffect(() => {
		if (chakra !== "") {
			setNamesLoading(true);
			let options = [
				{
					label: `Registered for current Slot`,
					title: `Registered for current Slot`,
					options: filterDataInSlot
						.filter((user: any) => user.chakra === chakra)
						.map((user: any) => ({
							label: user.name,
							value: user.id,
						})),
				},
				{
					label: `Registered for other slot`,
					title: `Registered for other slot`,
					options: filterDataNotInSlot
						.filter((user: any) => user.chakra === chakra)
						.map((user: any) => ({
							label: user.name,
							value: user.id,
						})),
				},
			];
			setNames(options);
			setNamesLoading(false);
		}
	}, [chakra]);

	const clearAll = () => {
		setChakra("");
		setFilteredME(0);
		setFilteredName(null);
		setRegistered(null);
	};

	useEffect(() => {
		clearAll();
	}, [slot]);

	const allowAssign = (user: any): boolean => {
		if (user.age < 10) return false;
		if (user.slots.includes(slot)) return true;
		else if (user.sevakaType === "K") {
			if (user.sevakaSlots.includes(slot)) return true;
			else return false;
		} else if (user.sevakaType === "KS") {
			return true;
		} else if (user.sevakaType === "S") {
			if (user.sevakaSlots.length === 0) return true;
			else if (user.sevakaSlots.includes(slot)) return true;
			else return false;
		} else if (user.sevakaType === "C") {
			return true;
		} else if (user.sevakaType === "FS") {
			if (user.sevakaSlots.includes(slot)) return true;
			else return false;
		}
		return false;
	};

	const calcCredit = (user: any) => {
		if (!user.sevakaType) return user.topUpCredit;
		else if (user.sevakaType === "K") {
			if (user.sevakaSlots.includes(slot)) {
				return user.topUpCredit + user.registrationFees;
			} else if (user.slots.includes(slot)) {
				return user.topUpCredit;
			} else return 0;
		} else if (user.sevakaType === "KS") {
			return user.totalAmt / 2 + 7.5;
		} else if (user.sevakaType === "S") {
			if (user.sevakaSlots.length === 0) return user.totalAmt / 2 + 7.5;
			else if (user.sevakaSlots.includes(slot)) {
				return user.topUpCredit + user.registrationFees + 7.5;
			} else if (user.slots.includes(slot)) {
				return user.topUpCredit;
			} else return 0;
		} else if (user.sevakaType === "C") {
			return user.topUpCredit + user.registrationFees;
		} else if (user.sevakaType === "FS") {
			// if (
			// 	(user.slots.includes(1) || user.slots.includes(2)) &&
			// 	user.slots.includes(3)
			// )
			if (user.sevakaSlots.includes(slot) && user.slots.includes(slot)) {
				return user.topUpCredit + user.registrationFees;
			} else return user.registrationFees / 2 + user.topUpCredit;
		} else return 0;
	};

	return (
		<>
			<div
				className={
					"top-0 fixed left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10" +
					(scan ? "" : " hidden")
				}
			>
				<div className="bg-white p-4 m-4 flex justify-center items-center flex-col rounded-lg w-full max-w-md">
					{scanStatus === "pending" ? (
						qrLoading ? (
							<Spin size="large" />
						) : (
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
						)
					) : scanStatus === "failed" ? (
						<div className="flex flex-col items-center gap-4">
							<h1 className="text-3xl font-bold text-red-600">
								QR Code Scan Failed
							</h1>
							{/* a input that takes whole width and only number can be written with label : Code */}
							<input
								type="number"
								pattern="[0-9]*"
								placeholder="Enter Code"
								className="w-full p-2 border border-gray-300 rounded"
							/>
							<div className="flex gap-4 w-full items-center justify-center">
								<button
									onClick={() => {}}
									className="bg-blue-500 text-white py-2 px-4 rounded"
								>
									Continue
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
			<div className="flex flex-col items-center justify-center w-full">
				{registered && (
					<button
						onClick={clearAll}
						className="text-slate-900 flex h-fit gap-2 justify-center items-center py-2"
					>
						<LeftOutlined />
						Back
					</button>
				)}
				<h3 className="text-2xl text-center text-black font-bold my-8">
					Check In Counters
				</h3>
			</div>
			{registered && registered.length !== 0 ? (
				<>
					{/* button with full width "Go Back" */}

					{registered.map((user: any) => (
						<div
							key={user.id}
							className="bg-white flex flex-col gap-4 items-center justify-center w-full p-2"
						>
							<div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
								<div className="justify-between w-full flex">
									<h2 className="text-xl font-bold">{user.name}</h2>
									{user.sevakaType && (
										<span className="bg-blue-500 flex items-center justify-center text-white py-1 px-2 rounded-full text-xs">
											{sevaka_classes[user.sevakaType]}
										</span>
									)}
								</div>
								<p>Chakra: {user.chakra}</p>
								<p>Age: {user.age}</p>
								<p>Top Up Credit: {calcCredit(user)}</p>
								{allowAssign(user) ? (
									<div className="flex gap-2 w-full">
										<button
											onClick={() => {
												// Handle assign wristband logic here
												let plate = prompt("Enter Plate Number");
												setPlate(plate || null);
												openScannerforWB(user);
											}}
											className="bg-slate-900 flex gap-2 justify-center items-center text-white w-full py-2 px-4 rounded mt-2"
										>
											<QrcodeOutlined />
											Assign
										</button>
									</div>
								) : user.age < 10 && user.slots.includes(slot) ? (
									<p className="text-green-700">Free Entry</p>
								) : (
									<p className="text-red-500">
										Registered for slot {user.slots}
									</p>
								)}
							</div>
						</div>
					))}
				</>
			) : registered?.length === 0 ? (
				<div>No results found</div>
			) : (
				<div className="bg-white flex flex-col gap-4 items-center justify-center w-full p-2">
					<div className="flex flex-col w-full p-2 gap-6 justify-center">
						<div
							onClick={openScannerforEmail}
							className="flex gap-2 bg-slate-900 text-white rounded-lg justify-center p-4 items-center"
						>
							<QrcodeOutlined />
							Scan QR Code
						</div>
						<Divider plain>OR</Divider>
						<div className="flex flex-col gap-2">
							<label className="text-black text-xl" htmlFor="chakra">
								Chakra
							</label>
							<Select
								showSearch
								className="w-full"
								size="large"
								placeholder="Search to Select"
								optionFilterProp="label"
								onChange={(value) => setChakra(value)}
								value={chakra}
								filterSort={(optionA, optionB) =>
									(optionA?.label ?? "")
										?.toString()
										.toLowerCase()
										.localeCompare((optionB?.label ?? "").toLowerCase())
								}
								options={[
									{
										value: "",
										label: " Select Chakra",
										disabled: true,
									},
									...chakraList.map((chakra) => ({
										label: chakra,
										value: chakra,
									})),
								]}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-black text-xl" htmlFor="chakra">
								Name
							</label>
							<Select
								loading={namesLoading}
								value={filteredName}
								onChange={(value) => setFilteredName(value)}
								showSearch
								className="w-full"
								size="large"
								placeholder="Search to Select"
								optionFilterProp="label"
								filterSort={(optionA, optionB) =>
									(optionA?.label ?? "")
										?.toString()
										.toLowerCase()
										.localeCompare(
											(optionB?.label ?? "")?.toString().toLowerCase()
										)
								}
								options={names}
							/>
						</div>
						<div
							onClick={filterWithName}
							className="flex cursor-pointer gap-2 bg-slate-900 text-white rounded-lg justify-center p-2 items-center"
						>
							<DoubleRightOutlined />
							Proceed
						</div>
					</div>
					<Divider plain>OR</Divider>
					<div className="w-full p-2 flex flex-col gap-2">
						<label className="text-black text-xl" htmlFor="mobile">
							Mobile
						</label>
						<Select
							onChange={(value) => setFilteredME(value)}
							value={filteredME}
							showSearch
							className="w-full"
							size="large"
							placeholder="Search to Select"
							optionFilterProp="label"
							filterSort={(optionA, optionB) =>
								(optionA?.label ?? "")
									?.toString()
									.toLowerCase()
									.localeCompare(
										(optionB?.label ?? "")?.toString().toLowerCase()
									)
							}
							options={[
								{
									value: 0,
									label: "Enter Mobile No.",
									disabled: true,
								},
								{
									label: `Registered for current Slot`,
									title: `Registered for current Slot`,
									options: filterDataInSlot.map((user: any) => ({
										label: `${user.phoneNo} - ${user.name}`,
										value: user.id,
									})),
								},
								{
									label: `Registered for other slot`,
									title: `Registered for other slot`,
									options: filterDataNotInSlot.map((user: any) => ({
										label: `${user.phoneNo} - ${user.name}`,
										value: user.id,
									})),
								},
							]}
						/>

						<label className="text-black text-xl" htmlFor="email">
							Email
						</label>
						<Select
							onChange={(value) => setFilteredME(value)}
							value={filteredME}
							showSearch
							className="w-full"
							size="large"
							placeholder="Search to Select"
							optionFilterProp="label"
							filterSort={(optionA, optionB) =>
								(optionA?.label ?? "")
									?.toString()
									.toLowerCase()
									.localeCompare(
										(optionB?.label ?? "")?.toString().toLowerCase()
									)
							}
							options={[
								{
									value: 0,
									label: "Enter Email Address",
									disabled: true,
								},
								{
									label: `Registered for current Slot`,
									title: `Registered for current Slot`,
									options: filterDataInSlot.map((user: any) => ({
										label: user.email,
										value: user.id,
									})),
								},
								{
									label: `Registered for other slot`,
									title: `Registered for other slot`,
									options: filterDataNotInSlot.map((user: any) => ({
										label: user.email,
										value: user.id,
									})),
								},
							]}
						/>
						<div
							onClick={filterWithME}
							className="flex gap-2 cursor-pointer bg-slate-900 text-white rounded-lg justify-center p-2 items-center"
						>
							<SearchOutlined />
							Search
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Assign;
