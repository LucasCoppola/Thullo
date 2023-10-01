'use client'

import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { Activity, Paperclip } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import SendComment from './send-comment'
import AttachmentComponent from './attachment'
import CardDescription from './card-description'
import CardMembers from './card-members-dropdown'
import AddLabel from './card-label'
import Tooltip from '../ui/tooltip'
import CardView from './card-view'
import UploadFile from '../upload-file'
import CardMembersList from './card-members-list'

import { CoverImageSelector, CardCoverImage } from './card-cover-image'
import { fetchAttachments, fetchCardMembers, fetchComments, fetchCoverImage, fetchLabels, fetchUser } from '@/app/fetch'
import type { Card, User } from '@prisma/client'
import type { CoverImageType } from '@/app/types'
import CardTitle from './card-title'

export default function CardModal({
	card,
	boardMembers,
	boardAuthorId,
	listId,
	listTitle
}: {
	card: Card
	boardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	boardAuthorId: string
	listId: string
	listTitle: string
}) {
	const [coverImage, setCoverImage] = useState<CoverImageType | null>(null)
	const [open, setOpen] = useState(false)

	const attachmentsQueryKey = ['attachments', card.id]
	const commentsQueryKey = ['comments', card.id]
	const labelsQueryKey = ['labels', card.id]
	const coverImageQueryKey = ['cover-image', card.id]
	const cardMembersQueryKey = ['card-members', card.id]
	const cardAuthorQueryKey = ['card-author', card.authorId]

	const { isLoading: isCoverImageLoading } = useQuery(coverImageQueryKey, () => fetchCoverImage(card.id), {
		onSuccess: (data) => {
			setCoverImage(data)
		}
	})
	const { data: labels } = useQuery(labelsQueryKey, () => fetchLabels(card.id))
	const { data: attachments } = useQuery(attachmentsQueryKey, () => fetchAttachments(card.id))
	const { data: cardAuthor } = useQuery(cardAuthorQueryKey, () => fetchUser(card.authorId))
	const { data: comments } = useQuery(commentsQueryKey, () => fetchComments(card.id))
	const { data: cardMembers, isLoading: isCardMembersLoading } = useQuery(cardMembersQueryKey, () =>
		fetchCardMembers(card.id)
	)

	const availableMembers = boardMembers?.filter((member) => {
		return (
			member.id !== card.authorId &&
			(!cardMembers || !cardMembers.some((cardMember) => cardMember.id === member.id))
		)
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<CardView
					setOpen={setOpen}
					card={card}
					attachmentsLength={attachments?.length || 0}
					commentsLength={comments?.length || 0}
					labels={labels || []}
					coverImage={coverImage}
					cardMembers={cardMembers}
					isCoverImageLoading={isCoverImageLoading}
					listId={listId}
					boardAuthorId={boardAuthorId}
				/>
			</DialogTrigger>
			<DialogContent className="overflow-y-auto max-h-[80vh] max-w-2xl pt-9">
				<DialogDescription asChild>
					<>
						<CardCoverImage
							coverImage={coverImage || null}
							setCoverImage={setCoverImage}
							card={card}
							isCoverImageLoading={isCoverImageLoading}
							boardAuthorId={boardAuthorId}
						/>

						<div className="flex flex-row">
							<div className="w-4/6">
								<CardTitle cardTitle={card.title} cardId={card.id} authorId={card.authorId} />

								<h2 className="text-xs text-gray-600 mt-1 mb-4">
									in list <strong>{listTitle}</strong>
								</h2>

								<CardDescription
									cardDescription={card.description || ''}
									cardId={card.id}
									authorId={card.authorId}
								/>

								{/* Attachments */}
								<div className="text-xs font-medium text-gray-600 flex flex-row items-center mb-4">
									<Paperclip className="h-3.5 w-3.5 mr-1" />
									Attachments
									<UploadFile cardId={card.id} />
									<Tooltip iconClassName="ml-2 text-gray-500" contentClassName="text-[10px] p-1">
										Only supports Images and pdf files.
									</Tooltip>
								</div>

								<div className="space-y-2">
									{attachments && attachments!.length > 0 ? (
										attachments?.map((attachment) => (
											<AttachmentComponent
												key={attachment.id}
												cardId={card.id}
												cardAuthorId={card.authorId}
												attachment={attachment}
											/>
										))
									) : (
										<p className="text-xs text-gray-500 my-6 flex items-center justify-center">
											There is no attachments yet...
										</p>
									)}
								</div>

								{/* Comments */}
								<span className="text-xs font-medium text-gray-600 flex flex-row items-center mt-4 mb-2">
									<Activity className="h-3.5 w-3.5 mr-1" />
									Activity
								</span>

								<SendComment cardId={card.id} cardAuthorId={card.authorId} comments={comments} />
							</div>

							<div className="flex flex-col w-2/6 gap-3 items-end">
								<CardMembers
									availableMembers={availableMembers}
									cardId={card.id}
									cardAuthorId={card.authorId}
								/>
								<AddLabel cardId={card.id} labels={labels || []} />
								<CoverImageSelector
									coverImage={coverImage || null}
									setCoverImage={setCoverImage}
									card={card}
									boardAuthorId={boardAuthorId}
								/>
								<CardMembersList
									card={card}
									cardMembers={cardMembers}
									cardAuthor={cardAuthor}
									isCardMembersLoading={isCardMembersLoading}
								/>
							</div>
						</div>
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}
