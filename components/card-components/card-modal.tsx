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
import type { Card, List, User } from '@prisma/client'
import type { CoverImageType } from '@/app/types'

export default function CardModal({ card, boardMembers, list }: { card: Card; boardMembers: User[]; list: List }) {
	const [coverImage, setCoverImage] = useState<CoverImageType | null>(null)
	const [open, setOpen] = useState(false)

	const attachmentsQueryKey = ['attachments', card.id]
	const commentsQueryKey = ['comments', card.id]
	const labelsQueryKey = ['labels', card.id]
	const coverImageQueryKey = ['cover-image', card.id]
	const cardMembersQueryKey = ['card-members', card.id]
	const cardAuthorQueryKey = ['card-author', card.authorId]

	const { data: comments, refetch: refetchComments } = useQuery(commentsQueryKey, () => fetchComments(card.id))
	const { data: labels, refetch: refetchLabels } = useQuery(labelsQueryKey, () => fetchLabels(card.id))
	const { data: cardAuthor } = useQuery(cardAuthorQueryKey, () => fetchUser(card.authorId))

	const { data } = useQuery(coverImageQueryKey, () => fetchCoverImage(card.id), {
		onSuccess: (data) => {
			setCoverImage(data)
		}
	})
	const { data: attachments, refetch: refetchAttachments } = useQuery(attachmentsQueryKey, () =>
		fetchAttachments(card.id)
	)
	const {
		data: cardMembers,
		refetch: refetchCardMembers,
		isLoading: isCardLoading
	} = useQuery(cardMembersQueryKey, () => fetchCardMembers(card.id))

	const availableMembers = boardMembers.filter((member) => {
		return !cardMembers?.find((cardMember) => cardMember.id === member.id)
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
					isCardLoading={isCardLoading}
				/>
			</DialogTrigger>
			<DialogContent className="overflow-y-auto max-h-[80vh] max-w-2xl pt-9">
				<DialogDescription asChild>
					<>
						<CardCoverImage coverImage={coverImage || null} setCoverImage={setCoverImage} card={card} />

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

								{/* Attachments */}
								<div className="text-xs font-medium text-gray-600 flex flex-row items-center mb-4">
									<Paperclip className="h-3.5 w-3.5 mr-1" />
									Attachments
									<UploadFile refetchAttachments={refetchAttachments} cardId={card.id} />
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
												refetchAttachments={refetchAttachments}
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

								<SendComment
									cardId={card.id}
									cardAuthorId={card.authorId}
									comments={comments}
									refetchComments={refetchComments}
								/>
							</div>

							<div className="flex flex-col w-2/6 gap-3 items-end">
								<CardMembers
									availableMembers={availableMembers}
									cardId={card.id}
									cardAuthorId={card.authorId}
								/>
								<AddLabel cardId={card.id} labels={labels || []} refetchLabels={refetchLabels} />
								<CoverImageSelector
									coverImage={coverImage || null}
									setCoverImage={setCoverImage}
									card={card}
								/>
								<CardMembersList
									card={card}
									cardMembers={cardMembers}
									refetchCardMembers={refetchCardMembers}
									cardAuthor={cardAuthor}
								/>
							</div>
						</div>
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}
