import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import Image from 'next/image'
import {
	Activity,
	Download,
	Paperclip,
	Trash,
	ArrowUpCircle
} from 'lucide-react'
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
			<DialogContent className="overflow-y-auto max-h-[80vh]">
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
						<Comment />
						<SendComment />
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}

function SendComment() {
	const [comment, setComment] = useState('')
	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className="flex flex-row w-4/6 items-center h-10 border-b border-gray-300 pb-4">
			<img
				src="https://avatars.dicebear.com/api/micah/lucas.svg"
				alt=""
				className="h-8 w-8 rounded-full object-cover mr-2"
			/>
			<div className="w-full relative flex items-center">
				{isEditing || comment.length > 0 ? (
					<div className="absolute flex flex-row w-full">
						<input
							placeholder="Add a comment..."
							className="w-full text-xs text-gray-900 p-1.5 outline-none"
							value={comment}
							onBlur={() => setIsEditing(false)}
							onChange={(e) => setComment(e.target.value)}
							autoFocus
							required
						/>
						<ArrowUpCircle
							role={`${comment.length > 0 ? 'button' : 'none'}`}
							color={`${comment.length > 0 ? 'blue' : 'gray'}`}
							className="relative top-1 right-0"
						/>
					</div>
				) : (
					<button
						onClick={() => setIsEditing(true)}
						className="w-full text-xs text-gray-400 rounded-sm p-1.5 hover:bg-gray-100 flex justify-start text-left"
					>
						Add a comment...
					</button>
				)}
			</div>
		</div>
	)
}

function Comment() {
	return (
		<div className="w-4/6">
			<div className="flex flex-row items-center">
				<img
					src="https://avatars.dicebear.com/api/micah/lucas.svg"
					alt=""
					className="h-8 w-8 rounded-full object-cover mr-2"
				/>
				<div className="flex flex-col w-full">
					<div className="flex flex-row justify-between items-center">
						<h2 className="text-xs font-medium">John Wick</h2>
						<div>
							<span
								role="button"
								className="text-[10px] text-gray-500 hover:underline mr-2"
							>
								Edit
							</span>
							<span
								role="button"
								className="text-[10px] text-gray-500 hover:underline"
							>
								Delete
							</span>
						</div>
					</div>
					<span className="text-[8px] text-gray-500">
						Sep 6 at 11:28 AM
					</span>
				</div>
			</div>
			<p className="pl-10 text-xs text-gray-900 mt-1">
				Once the ideas is clearly defined, the task can move to #todo
				stage.
			</p>
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
