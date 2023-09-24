export default function SkeletonComment() {
	return (
		<div className="animate-pulse flex">
			<div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
			<div className="flex flex-col w-4/5 justify-evenly">
				<div className="h-2 w-3/5 bg-gray-200 rounded-full"></div>
				<div className="h-2.5 w-3/5 bg-gray-200 rounded-full"></div>
			</div>
		</div>
	)
}
