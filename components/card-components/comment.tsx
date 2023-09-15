import Image from 'next/image'
import { ArrowUpCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { findUserById } from '@/app/server/usersOperations'
import {
	addComment,
	getComments,
	removeComment,
	updateComment
} from '@/app/server/cardOperations'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import type { Comment } from '@prisma/client'

export default function SendComment({
	cardId,
	cardAuthorId
}: {
	cardId: string
	cardAuthorId: string
}) {
	const { data: session } = useSession()
	const [comment, setComment] = useState('')
	const [isEditing, setIsEditing] = useState(false)

	const { data: comments, refetch } = useQuery(
		['comments', cardId],
		async () => {
			const { comments } = await getComments({ cardId })
			return comments
		}
	)

	const addCommentMutation = useMutation(
		async () => {
			await addComment({ authorId: session?.userId!, cardId, comment })
		},

		{
			onSuccess: () => {
				console.log('comment added')
				setComment('')
			},
			onError: (e) => console.error((e as Error).message),
			onSettled: () => refetch()
		}
	)

	return (
		<>
			<div className="space-y-3">
				{comments?.map((comment) => (
					<Comment
						key={comment.id}
						userId={session?.userId!}
						cardAuthorId={cardAuthorId}
						refetchComments={refetch}
						{...comment}
					/>
				))}
			</div>
			<div className="border-b border-gray-300 pb-3 w-full mt-3">
				<div className="flex flex-row items-center h-10">
					<Image
						src={
							session?.user?.image ||
							`https://avatars.dicebear.com/api/micah/${session?.user?.name}.svg`
						}
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
									role={`${
										comment.length > 0 ? 'button' : 'none'
									}`}
									color={`${
										comment.length > 0 ? 'blue' : 'gray'
									}`}
									className="relative top-1 right-0"
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

function Comment({
	id,
	userId,
	authorId,
	cardAuthorId,
	cardId,
	updatedAt,
	text: originalText,
	refetchComments
}: Comment & {
	userId: string
	cardAuthorId: string
	refetchComments: () => void
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [comment, setComment] = useState(originalText)

	const { data: user } = useQuery(['user', authorId], async () => {
		const { author } = await findUserById({ id: authorId })
		return author
	})

	const updateCommentMutation = useMutation(
		async () => {
			await updateComment({
				authorId,
				cardId,
				commentId: id,
				comment,
				userId
			})
			setIsEditing(false) // Exit edit mode after saving
		},
		{
			onSettled: () => refetchComments()
		}
	)

	const removeCommentMutation = useMutation(
		async () => {
			await removeComment({
				cardId,
				commentId: id,
				commentAuthor: user?.id!,
				cardAuthor: cardAuthorId,
				userId
			})
		},
		{
			onSettled: () => refetchComments()
		}
	)

	const editComment = () => {
		setComment(originalText) // Reset comment text to original when editing starts
		setIsEditing(true)
	}

	return (
		<div className="w-full">
			<div className="flex flex-row items-center">
				<Image
					src={
						user?.image ||
						`https://avatars.dicebear.com/api/micah/${user?.name}.svg`
					}
					alt="user avatar"
					className="h-8 w-8 rounded-full object-cover mr-2"
					width={400}
					height={400}
				/>
				<div className="w-full relative flex items-center">
					{isEditing ? (
						<div className="absolute flex flex-row w-full">
							<input
								placeholder="Edit your comment..."
								className="w-full text-xs text-gray-900 p-1.5 outline-none"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								autoFocus
								required
							/>
							<button
								className="text-[10px] text-gray-500 hover:underline ml-2"
								onClick={() => updateCommentMutation.mutate()}
							>
								Save
							</button>
						</div>
					) : (
						<div className="flex flex-row justify-between w-full">
							<div className="flex flex-col">
								<h2 className="text-xs font-medium">
									{user?.name}
								</h2>
								<span className="text-[8px] text-gray-500">
									{new Date(updatedAt).toLocaleDateString(
										'en-us',
										{
											month: 'short',
											day: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
											hour12: true
										}
									)}
								</span>
							</div>
							<div>
								<button
									className="text-[10px] text-gray-500 hover:underline mr-2"
									onClick={editComment}
								>
									Edit
								</button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button
											className="text-[10px] text-gray-500 hover:underline"
											onClick={() =>
												removeCommentMutation.mutate()
											}
										>
											Delete
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												this comment from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 hover:bg-red-600"
												onClick={() =>
													removeCommentMutation.mutate()
												}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					)}
				</div>
			</div>
			{!isEditing && (
				<p className="pl-10 text-xs text-gray-900">{comment}</p>
			)}
		</div>
	)
}
