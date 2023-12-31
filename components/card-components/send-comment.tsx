import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '@/app/server/card-operations/comments'
import { ArrowUpCircle } from 'lucide-react'
import CommentComponent from './comment'

import type { Comment } from '@prisma/client'
import { toast } from 'sonner'

export default function SendComment({
	cardId,
	cardAuthorId,
	comments
}: {
	cardId: string
	cardAuthorId: string
	comments: Comment[] | undefined
}) {
	const { data: session } = useSession()
	const [comment, setComment] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const queryClient = useQueryClient()

	const handleQueryInvalidation = (cardId: string) => {
		queryClient.invalidateQueries(['comments', cardId])
	}

	const addCommentMutation = useMutation(
		async () => {
			if (!session) return
			return await addComment({ authorId: session.userId, cardId, comment })
		},

		{
			onSuccess: () => {
				toast.success('Comment added')
				setComment('')
			},
			onError: (e) => toast.error((e as Error).message),
			onSettled: () => handleQueryInvalidation(cardId)
		}
	)

	return (
		<>
			<div className="space-y-3">
				{comments?.map((comment) => (
					<CommentComponent
						key={comment.id}
						userId={session?.userId!}
						cardAuthorId={cardAuthorId}
						setQueryInvalidation={handleQueryInvalidation}
						{...comment}
					/>
				))}
			</div>
			<div className="border-b border-gray-300 pb-3 w-full mt-3">
				<div className="flex flex-row items-center h-10">
					<Image
						src={session?.user?.image || ''}
						alt="user avatar"
						className="h-8 w-8 rounded-full object-cover mr-2"
						width={400}
						height={400}
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
									className={`h-6 w-6 relative top-1 right-0 ${
										comment.length > 0 ? 'text-blue-600' : 'text-gray-400 cursor-not-allowed'
									}`}
									onClick={() => addCommentMutation.mutate()}
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
			</div>
		</>
	)
}
