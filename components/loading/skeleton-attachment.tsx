export default function SkeletonAttachment() {
	return (
		<div className="animate-pulse flex w-full">
			<div className="h-14 w-20 bg-gray-200 rounded-sm mr-3"></div>
			<div className="flex flex-col space-y-2 justify-evenly w-2/5">
				<div className="h-2 bg-gray-200 rounded w-4/5"></div>
				<div className="h-2.5 bg-gray-200 rounded"></div>
				<div className="h-2 bg-gray-200 rounded w-3/5"></div>
			</div>
		</div>
	)
}
