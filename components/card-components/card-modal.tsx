'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTrigger
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Activity, Paperclip } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAttachments, getComments } from '@/app/server/cardOperations'
import { useSession } from 'next-auth/react'

import SendComment from './send-comment'
import Image from 'next/image'
import AttachmentComponent from './attachment'
import CardDescription from './card-description'
import CardMembers from './card-members'
import CoverImage from './card-cover-image'
import AddLabel from './card-label'
import Tooltip from '../ui/tooltip'
import CardView from './card-view'
import UploadFile from '../upload-file'

import type { Card, List, User } from '@prisma/client'

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
	const remainingAvatars = boardMembers?.length! - 2

	const { data: comments, refetch: refetchComments } = useQuery(
		['comments', card.id],
		async () => {
			const { comments } = await getComments({ cardId: card.id })
			return comments
		}
	)

	const { data: attachments, refetch: refetchAttachments } = useQuery(
		['attachments', card.id],
		async () => {
			const { attachments } = await getAttachments({ cardId: card.id })
			return attachments
		}
	)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<CardView
					setOpen={setOpen}
					card={card}
					attachmentsLength={attachments?.length || 0}
					commentsLength={comments?.length || 0}
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
									<UploadFile
										refetchAttachments={refetchAttachments}
										cardId={card.id}
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
									comments={comments}
									refetchComments={refetchComments}
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
