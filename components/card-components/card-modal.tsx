'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTrigger
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Activity, Paperclip, MessageSquare } from 'lucide-react'
import SendComment from './send-comment'
import Image from 'next/image'
import AttachmentComponent from './attachment'
import CardDescription from './card-description'
import CardMembers from './card-members'
import CoverImage from './card-cover-image'
import AddLabel from './card-label'

import type { Card, List, User } from '@prisma/client'
import type { UploadFileResponse } from 'uploadthing/client'

import { UploadButton } from '@/lib/uploadthing'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createAttachment, getAttachments } from '@/app/server/cardOperations'
import { useSession } from 'next-auth/react'
import Tooltip from '../ui/tooltip'

export default function CardModal({
	card,
	boardMembers,
	list
}: {
	card: Card
	boardMembers: User[]
	list: List
}) {
	const [open, setOpen] = useState(false)
	const { data: session } = useSession()
	const remainingAvatars = boardMembers?.length! - 2

	const { data: attachments, refetch: refetchAttachments } = useQuery(
		['attachments', card.id],
		async () => {
			const { attachments } = await getAttachments({ cardId: card.id })
			return attachments
		}
	)

	const attachmentMutation = useMutation(async (file: UploadFileResponse) => {
		if (!file) return

		await createAttachment({
			id: file.fileKey,
			filename: file.fileName,
			url: file.url,
			size: file.size,
			userId: session?.userId!,
			cardId: card.id
		})
		refetchAttachments()
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<CardView
					setOpen={setOpen}
					card={card}
					attachmentsLength={attachments?.length || 0}
				/>
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
												attachmentMutation.mutate(
													res[0]!
												)
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

								<div className="space-y-2">
									{attachments && attachments.length > 0 ? (
										attachments?.map((attachment) => (
											<AttachmentComponent
												key={attachment.id}
												cardId={card.id}
												cardAuthorId={card.authorId}
												attachment={attachment}
												refetchAttachments={
													refetchAttachments
												}
											/>
										))
									) : (
										<p className="text-xs text-gray-500 my-6 flex items-center justify-center">
											There is no attachments yet...
										</p>
									)}
								</div>

								<span className="text-xs font-medium text-gray-600 flex flex-row items-center mt-4 mb-2">
									<Activity className="h-3.5 w-3.5 mr-1" />
									Activity
								</span>

								<SendComment
									cardId={card.id}
									cardAuthorId={card.authorId}
								/>
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

function CardView({
	setOpen,
	card,
	attachmentsLength
}: {
	setOpen: (val: boolean) => void
	card: Card
	attachmentsLength: number
}) {
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
	return (
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
			<div className="flex flex-row justify-between items-center pt-2">
				<div className="flex -space-x-1 overflow-hidden items-center">
					{/* {members.map(({ image, name, id }) => (
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
					))} */}
					{/* {remainingAvatars > 0 && (
						<span className="text-gray-500 text-xs tracking-tight pl-2">
							+{remainingAvatars}{' '}
							{remainingAvatars === 1 ? 'other' : 'others'}
						</span>
					)} */}
				</div>
				<div className="flex flex-row text-gray-500 items-center">
					{/* <span className="flex flex-row text-xs mr-2">
						<MessageSquare className="h-3.5 w-3.5 mr-0.5" />2
					</span> */}
					{attachmentsLength > 0 && (
						<span
							className="flex flex-row text-xs"
							title="Attachments"
						>
							<Paperclip className="h-3.5 w-3.5 mr-0.5" />
							{attachmentsLength}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
