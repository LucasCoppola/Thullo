export default function SkeletonCard() {
	return (
		<div role="status" className="max-w-sm rounded p-3">
			<div className="h-2.5 bg-gray-200 rounded-full w-48 mb-2"></div>
			<div className="h-1.5 bg-gray-200 rounded-full mb-1.5"></div>
			<div className="h-1.5 bg-gray-200 rounded-full mb-1.5"></div>
			<div className="h-1.5 bg-gray-200 rounded-full"></div>
			<div className="flex items-center mt-3 space-x-3"></div>
			<span className="sr-only">Loading...</span>
		</div>
	)
}
