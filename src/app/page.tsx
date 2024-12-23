export default function Home() {
	return (
		<div className="bg-white flex flex-col gap-2 items-center justify-center w-full min-h-screen p-2">
			<div className="flex w-full h-64 gap-2 items-center justify-center">
				<div className="flex w-1/2 h-full items-center justify-center bg-slate-950">
					Check In Counters
				</div>
				<div className="flex w-1/2 h-full items-center justify-center bg-slate-950">
					Food Stalls
				</div>
			</div>
			<div className="flex w-full h-64 gap-2 items-center justify-center">
				<div className="flex w-1/2 h-full items-center justify-center bg-slate-950">
					Henna Stalls
				</div>
				<div className="flex w-1/2 h-full items-center justify-center bg-slate-950">
					Top Up Counters
				</div>
			</div>
		</div>
	);
}
