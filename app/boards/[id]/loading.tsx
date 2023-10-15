export default function LoadingBoardIdPage() {
	return (
		<div className="mx-8 animate-pulse">
			<div className="mt-4 flex items-center justify-between">
				<div className="h-8 w-72 rounded-md bg-gray-100"></div>
				<div className="h-6 w-8 rounded-md bg-gray-100"></div>
			</div>
			<div className="mt-10 flex gap-8 px-2">
				<div className="h-[75vw] w-[265px] rounded-md bg-gray-100"></div>
				<div className="h-[75vw] w-[265px] rounded-md bg-gray-100"></div>
				<div className="h-[75vw] w-[265px] rounded-md bg-gray-100"></div>
				<div className="h-[75vw] w-[265px] rounded-md bg-gray-100"></div>
			</div>
		</div>
	)
}
