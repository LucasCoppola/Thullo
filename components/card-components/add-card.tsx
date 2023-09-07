import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import Image from 'next/image'
import { Activity, Download, Paperclip, Trash } from 'lucide-react'
import CardDescription from './card-description'
import { Add } from '../ui/icons'

export default function AddCard({
	open,
	setOpen
}: {
	open: boolean
	setOpen: (val: boolean) => void
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="overflow-y-auto">
				<DialogHeader>
					<DialogTitle asChild className="mb-2">
						<>
							<Image
								src="https://images.unsplash.com/photo-1693856757774-e749742aefe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
								alt="unsplash random image"
								width={400}
								height={400}
								className="w-full h-32 object-cover rounded-lg"
							/>
							<h1 className="font-medium">Card Title</h1>
							<h2 className="text-xs text-gray-600 mt-2.5">
								in list <strong>In Progress</strong>
							</h2>
						</>
					</DialogTitle>
				</DialogHeader>
				<DialogDescription asChild>
					<>
						<CardDescription
							cardDescription=""
							cardDescriptionMutation=""
						/>

						<span className="text-xs font-medium text-gray-600 flex flex-row items-center">
							<Paperclip className="h-3.5 w-3.5 mr-1" />
							Attachments
							<span className="text-[10px] ml-3 p-0.5 rounded-sm text-gray-500 cursor-pointer hover:bg-gray-100 flex flex-row items-center">
								<Add className="h-3.5 w-3.5 mr-0.5" />
								Add attachment
							</span>
						</span>
						<Attachment />

						<span className="text-xs font-medium text-gray-600 flex flex-row items-center mt-2">
							<Activity className="h-3.5 w-3.5 mr-1" />
							Activity
						</span>
						<SendComment />
						<Comment />
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}

function SendComment() {
	return (
		<div className="flex flex-row w-4/6">
			<img
				src="https://avatars.dicebear.com/api/micah/lucas.svg"
				alt=""
				className="h-8 w-8 rounded-full object-cover mr-2"
			/>
			<div className="flex-grow w-full">
				<textarea
					placeholder="Add a comment..."
					className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-300"
					rows={1}
					required
				/>
				<button className="bg-blue-500 text-white rounded-lg px-3 py-1.5 text-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
					Comment
				</button>
			</div>
		</div>
	)
}

function Comment() {
	return (
		<div className="flex flex-row w-4/6">
			<img
				src="https://avatars.dicebear.com/api/micah/lucas.svg"
				alt=""
				className="h-8 w-8 rounded-full object-cover mr-2"
			/>
			<h2>John Wick</h2>
			<span>24 August at 20:43</span>
		</div>
	)
}

function Attachment() {
	return (
		<>
			<div className="flex flex-row w-4/6">
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
			<div className="flex flex-row w-4/6">
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
