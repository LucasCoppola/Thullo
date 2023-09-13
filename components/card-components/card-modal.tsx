'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTrigger
} from '@/components/ui/dialog'
import { Activity, Paperclip } from 'lucide-react'
import { Comment, SendComment } from './comment'
import Image from 'next/image'
import AttachmentComponent from './attachment'
import CardDescription from './card-description'
import CardMembers from './card-members'
import CoverImage from './card-cover-image'
import AddLabel from './card-label'
import type { Attachment, Card, List, User } from '@prisma/client'

import { useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'
import { useMutation } from '@tanstack/react-query'
import { createAttachment } from '@/app/server/cardOperations'
import { UploadFileResponse } from 'uploadthing/client'
import { useSession } from 'next-auth/react'
import Tooltip from '../ui/tooltip'

export default function CardModal({
	card,
	boardMembers,
	list,
	attachments
}: {
	card: Card
	boardMembers: User[]
	list: List
	attachments: Attachment[]
}) {
	const [open, setOpen] = useState(false)
	const remainingAvatars = boardMembers?.length! - 2

	const fakeLabelJson = [
		{
			id: 'bveureobveybo8',
			name: 'Technical',
			color: { text: '#16a34a', bg: '#dcfce7' }
		},
		{
			id: 'brwuvbrwu9br',
			name: 'Fast',
			color: { text: '#dc2626', bg: '#fee2e2' }
		},
		{
			id: 'verget',
			name: 'Do it now',
			color: { text: '#2563eb', bg: '#dbeafe' }
		},
		{
			id: 'obveybo8',
			name: 'Critical',
			color: { text: '#ea580c', bg: '#ffedd5' }
		},

		{
			id: 'viwrno',
			name: 'Technical',
			color: { text: '#16a34a', bg: '#dcfce7' }
		}
	]

	const [file, setFile] = useState<UploadFileResponse | null>(null)
	const { data: session } = useSession()

	const attachmentMutation = useMutation(async () => {
		console.log(file, 'is this? 1')
		if (!file) return
		console.log(file, 'is this?')

		await createAttachment({
			filename: file.fileName,
			url: file.url,
			size: file.size,
			userId: session?.userId!,
			cardId: card.id
		}),
			{
				onSuccess: () => {
					console.log(
						'Success, uploaded file: ',
						attachmentMutation.data
					)
				},
				onError: () => {
					console.error('Error: ', attachmentMutation.error)
				}
			}
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div
					className="bg-white rounded-xl shadow-md hover:shadow-lg p-3 space-y-2"
					style={{ width: '243px' }}
					onClick={() => setOpen(true)}
				>
					{/*
				 Json object {type: color | image, bg: string} 
				 I have to update the prisma schema
				*/}
					{card.coverImage && (
						<Image
							className="w-full h-[138px] rounded-xl object-cover"
							src={card.coverImage}
							alt="card cover image"
							width={200}
							height={50}
						/>
					)}

					<h3 className="font-medium">{card.title}</h3>
					<div className="flex flex-row gap-2 flex-wrap">
						{fakeLabelJson.map(({ color, id, name }) => (
							<span
								key={id}
								className="text-[10px] rounded-sm px-2 py-[1px]"
								style={{
									backgroundColor: color.bg,
									color: color.text
								}}
							>
								{name}
							</span>
						))}
					</div>
					{/* <div className="flex flex-row justify-between items-center pt-2">
					<div className="flex -space-x-1 overflow-hidden items-center">
						{members.map(({ image, name, id }) => (
							<Image
								key={id}
								src={
									image ||
									`https://avatars.dicebear.com/api/micah/${name}.svg`
								}
								alt={`${name} avatar`}
								title={name!}
								className="w-6 h-6 inline-block rounded-full ring-2 ring-white"
								width={400}
								height={400}
							/>
						))}
						{remainingAvatars > 0 && (
							<span className="text-gray-500 text-xs tracking-tight pl-2">
								+{remainingAvatars}{' '}
								{remainingAvatars === 1 ? 'other' : 'others'}
							</span>
						)}
					</div>
					<div className="flex flex-row text-gray-500">
						<span className="flex flex-row text-xs mr-2">
							<MessageSquare className="h-4 w-4 mr-0.5" />2
						</span>
						<span className="flex flex-row text-xs">
							<Paperclip className="h-4 w-4 mr-0.5" />2
						</span>
					</div>
				</div> */}
				</div>
			</DialogTrigger>
			<DialogContent className="overflow-y-auto max-h-[80vh] max-w-2xl">
				<DialogDescription asChild>
					<>
						<Image
							src="https://images.unsplash.com/photo-1693856757774-e749742aefe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
							alt="unsplash random image"
							width={400}
							height={400}
							className="w-full h-32 object-cover rounded-lg"
						/>
						<div className="flex flex-row">
							<div className="w-4/6">
								<h1 className="font-medium">{card.title}</h1>
								<h2 className="text-xs text-gray-600 mt-1 mb-4">
									in list <strong>{list?.title}</strong>
								</h2>
								<CardDescription
									cardDescription={card.description || ''}
									cardId={card.id}
									authorId={card.authorId}
								/>

								<div className="text-xs font-medium text-gray-600 flex flex-row items-center mb-4">
									<Paperclip className="h-3.5 w-3.5 mr-1" />
									Attachments
									<UploadButton
										content={{
											button({ isUploading }) {
												if (isUploading)
													return <div>Loading...</div>
											}
										}}
										appearance={{
											button: 'text-gray-500 ut-uploading:cursor-not-allowed ut-uploading:text-gray-500 h-5 ut-button:bg-gray-100 text-[10px] ml-3 p-0.5 rounded-sm text-gray-500 cursor-pointer hover:bg-gray-100 flex flex-row items-center px-2',
											allowedContent:
												'flex h-8 flex-col items-center justify-center px-2 hidden'
										}}
										endpoint="imageUploader"
										onClientUploadComplete={(res) => {
											if (res) {
												setFile(res[0])
												attachmentMutation.mutate()
											}
										}}
										onUploadError={(error: Error) => {
											console.log(
												'Error: ',
												error.message
											)
											alert(`ERROR! ${error.message}`)
										}}
									/>
									<Tooltip
										iconClassName="ml-2 text-gray-500"
										contentClassName="text-[10px] p-1"
									>
										Only supports Images and pdf files.
									</Tooltip>
								</div>

								{attachments.length > 0 ? (
									attachments.map((attachment) => (
										<AttachmentComponent
											key={attachment.id}
											cardId={card.id}
											attachment={attachment}
										/>
									))
								) : (
									<p className="text-xs text-gray-500 my-6 flex items-center justify-center">
										There is no attachments yet...
									</p>
								)}

								<span className="text-xs font-medium text-gray-600 flex flex-row items-center mt-4 mb-2">
									<Activity className="h-3.5 w-3.5 mr-1" />
									Activity
								</span>
								<Comment />
								<SendComment />
							</div>

							<div className="flex flex-col w-2/6 gap-3 items-end">
								<CardMembers />
								<AddLabel />
								<CoverImage />
							</div>
						</div>
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}
