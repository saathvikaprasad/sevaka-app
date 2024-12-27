"use client";
import { useEffect, useState } from "react";
import { getDataForSlot } from "./actions";
import { LogoutOutlined } from "@ant-design/icons";
import Assign from "./Assign";
import { useRouter } from "next/navigation";

const Page = () => {
	const [slot, setSlot] = useState(1);
	const [data, setData] = useState<any>(null);
	const [mainDB, setMainDB] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const getCookieValue = (cookieName: string) => {
		const cookies = document.cookie.split("; ");
		for (const cookie of cookies) {
			const [name, value] = cookie.split("=");
			if (name === cookieName) {
				return decodeURIComponent(value);
			}
		}
		return null;
	};

	useEffect(() => {
		// aceess nextjs cookies in client side
		const authToken = getCookieValue("authToken");
		if (!authToken) {
			// redirect to login page
			router.push("checkin/login");
		} else {
			setLoading(true);
			getDataForSlot(slot)
				.then((res) => {
					setMainDB(res);
					const filteredInSlot = res.filter((d) => d.slots?.includes(slot));
					const filteredNotInSlot = res.filter((d) => !d.slots?.includes(slot));
					setData({ filteredInSlot, filteredNotInSlot });
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, []);

	useEffect(() => {
		if (mainDB) {
			setLoading(true);
			const filteredInSlot = mainDB.filter((d: any) => d.slots?.includes(slot));
			const filteredNotInSlot = mainDB.filter(
				(d: any) => !d.slots?.includes(slot)
			);
			setData({ filteredInSlot, filteredNotInSlot });
			setLoading(false);
		}
	}, [slot]);

	return (
		<div className="bg-white flex flex-col gap-4 items-center justify-center w-full p-2">
			<div className="flex w-full gap-2 items-center justify-center">
				<select
					onChange={(e) => setSlot(parseInt(e.target.value))}
					className="w-1/2 p-2 border border-gray-300 rounded-lg"
					value={slot}
				>
					<option value={1}>Slot 1</option>
					<option value={2}>Slot 2</option>
					<option value={3}>Slot 3</option>
				</select>
				<div className="flex gap-2 bg-red-800 text-white rounded-lg justify-center p-2 items-center">
					<LogoutOutlined />
					Logout
				</div>
			</div>
			{loading ? (
				<div className="flex justify-center items-center w-full h-full">
					<div
						className="spinner-border animate-spin inline-block w-16 h-16 border-8 border-t-8 border-t-blue-500 rounded-full"
						role="status"
					>
						<span className="hidden">Loading...</span>
					</div>
				</div>
			) : (
				<Assign
					filterDataInSlot={data?.filteredInSlot || []}
					filterDataNotInSlot={data?.filteredNotInSlot || []}
					slot={slot}
				/>
			)}
		</div>
	);
};

export default Page;
