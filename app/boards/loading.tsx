export default function Loading() {
	return (
		<div className="mx-24 animate-pulse">
			<div className="mt-14 mb-6 flex justify-between w-full">
				<div className="h-8 w-24 rounded-md bg-gray-100"></div>
				<div className="h-8 w-24 rounded-md bg-gray-100"></div>
			</div>

			<div className="flex flex-wrap gap-9">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="h-60 w-60 rounded-md bg-gray-100"></div>
				))}
			</div>
		</div>
	)
}
