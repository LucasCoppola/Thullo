import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import Image from 'next/image'
import { Download, Paperclip, Trash } from 'lucide-react'
import CardDescription from './card-description'

export default function AddCard({
	open,
	setOpen
}: {
	open: boolean
	setOpen: (val: boolean) => void
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
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
						</span>
						<Attachment />
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}

function Attachment() {
	return (
		<>
			<div className="flex flex-row">
				<Image
					src="https://images.unsplash.com/photo-1693856757774-e749742aefe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
					alt="unsplash random image"
					width={400}
					height={400}
					className="w-20 h-14 object-cover rounded-lg mr-3"
				/>
				<div className="flex flex-col">
					<div className="flex flex-row mb-1.5">
						<span className="text-[11px] text-gray-500">
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
					<h3 className="text-sm text-gray-900 font-medium">
						Reasoning by Ranganath Krishnamani
					</h3>
				</div>
			</div>
			<div className="flex flex-row">
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

				<div className="flex flex-col">
					<div className="flex flex-row mb-1.5">
						<span className="text-[11px] text-gray-500">
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
					<h3 className="text-sm text-gray-900 font-medium">
						Gatsby-config.js
					</h3>
				</div>
			</div>
		</>
	)
}
