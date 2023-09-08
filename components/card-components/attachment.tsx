import Image from 'next/image'
import { Download, Trash } from 'lucide-react'

export default function Attachment() {
	return (
		<>
			<div className="flex flex-row w-full mb-3">
				<Image
					src="https://images.unsplash.com/photo-1693856757774-e749742aefe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
					alt="unsplash random image"
					width={400}
					height={400}
					className="w-20 h-14 object-cover rounded-lg mr-3"
				/>
				<div className="flex flex-col w-4/6">
					<div className="flex flex-row mb-1.5">
						<span className="text-[10px] text-gray-500">
							Added July 5, 2023
						</span>
						<div className="ml-auto flex flex-row items-center">
							<Download
								className="h-3.5 w-3.5 text-blue-600"
								role="button"
							/>
							<Trash
								className="h-3.5 w-3.5 text-red-600 ml-2"
								role="button"
							/>
						</div>
					</div>
					<h3 className="text-xs text-gray-900 font-medium">
						Reasoning by Ranganath Krishnamani
					</h3>
				</div>
			</div>
			<div className="flex flex-row w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 80 56"
					className="rounded-lg mr-3"
					width="80px"
					height="56px"
				>
					<rect width="100%" height="100%" fill="#e0e0e0" />
					<text
						x="50%"
						y="50%"
						font-size="20"
						text-anchor="middle"
						dy=".3em"
						fill="#999"
					>
						GA
					</text>
				</svg>

				<div className="flex flex-col w-4/6">
					<div className="flex flex-row mb-1.5 justify-between">
						<span className="text-[10px] text-gray-500">
							Added July 5, 2023
						</span>
						<div className="flex flex-row items-center">
							<Download
								className="h-3.5 w-3.5 text-blue-600"
								role="button"
							/>
							<Trash
								className="h-3.5 w-3.5 text-red-600 ml-2"
								role="button"
							/>
						</div>
					</div>
					<h3 className="text-xs text-gray-900 font-medium">
						Reasoning by Ranganath Krishnamani
					</h3>
				</div>
			</div>
		</>
	)
}
