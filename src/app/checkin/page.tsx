"use client";
import {
	DoubleRightOutlined,
	QrcodeOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Divider, Select } from "antd";
const Page = () => {
	return (
		<div className="bg-white flex flex-col gap-4 items-center justify-center w-full p-2">
			<h3 className="text-2xl text-black font-bold">Check In Counters</h3>
			<div className="flex flex-col w-full p-2 gap-6 justify-center">
				<div className="flex gap-2 bg-slate-900 text-white rounded-lg justify-center p-4 items-center">
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
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? "")
								.toLowerCase()
								.localeCompare((optionB?.label ?? "").toLowerCase())
						}
						options={[
							{
								value: "1",
								label: "Not Identified",
							},
							{
								value: "2",
								label: "Closed",
							},
							{
								value: "3",
								label: "Communicated",
							},
							{
								value: "4",
								label: "Identified",
							},
							{
								value: "5",
								label: "Resolved",
							},
							{
								value: "6",
								label: "Cancelled",
							},
						]}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-black text-xl" htmlFor="chakra">
						Name
					</label>
					<Select
						showSearch
						className="w-full"
						size="large"
						placeholder="Search to Select"
						optionFilterProp="label"
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? "")
								.toLowerCase()
								.localeCompare((optionB?.label ?? "").toLowerCase())
						}
						options={[
							{
								value: "1",
								label: "Not Identified",
							},
							{
								value: "2",
								label: "Closed",
							},
							{
								value: "3",
								label: "Communicated",
							},
							{
								value: "4",
								label: "Identified",
							},
							{
								value: "5",
								label: "Resolved",
							},
							{
								value: "6",
								label: "Cancelled",
							},
						]}
					/>
				</div>
				<div className="flex gap-2 bg-slate-900 text-white rounded-lg justify-center p-2 items-center">
					<DoubleRightOutlined />
					Proceed
				</div>
			</div>
			<Divider plain>OR</Divider>
			<div className="w-full p-2 flex flex-col gap-2">
				<label className="text-black text-xl" htmlFor="mobile">
					Mobile
				</label>
				<input
					type="tel"
					className="w-full p-2 border border-gray-300 rounded-lg"
					placeholder="Mobile Number"
				/>
				<div className="flex gap-2 bg-slate-900 text-white rounded-lg justify-center p-2 items-center">
					<SearchOutlined />
					Search
				</div>
			</div>
			<Divider plain>OR</Divider>
			<div className="w-full p-2 flex flex-col gap-2">
				<label className="text-black text-xl" htmlFor="email">
					Email
				</label>
				<input
					type="email"
					className="w-full p-2 border border-gray-300 rounded-lg"
					placeholder="Email Address"
				/>
				<div className="flex gap-2 bg-slate-900 text-white rounded-lg justify-center p-2 items-center">
					<SearchOutlined />
					Search
				</div>
			</div>
		</div>
	);
};

export default Page;
