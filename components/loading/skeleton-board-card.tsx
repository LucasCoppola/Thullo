export default function SkeletonBoardCard() {
	return (
		<div role="status" className="bg-white animate-pulse rounded-xl shadow-sm w-60 h-60">
			<div className="w-full h-[138px] rounded-t-xl mb-3 bg-gray-100"></div>
			<div className="px-3">
				<div className="flex items-center justify-between mb-4">
					<div className="h-6 bg-gray-100 rounded-sm w-40"></div>
					<div className="h-6 bg-gray-100 rounded-sm w-6"></div>
				</div>
				<div className="flex space-x-3 flex-row items-center">
					<div className="w-8 h-8 rounded-lg bg-gray-100"></div>
					<div className="w-8 h-8 rounded-lg bg-gray-100"></div>
					<div className="w-8 h-8 rounded-lg bg-gray-100"></div>
				</div>
			</div>
		</div>
	)
}
