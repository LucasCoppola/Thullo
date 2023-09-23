import Image from 'next/image'
import { ArrowUpCircle, MoreHorizontal, PencilLine, Trash2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchUser } from '@/app/fetch'
import { removeComment, updateComment } from '@/app/server/card-operations/comments'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { Comment } from '@prisma/client'

export default function Comment({
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
	const [openAlertDialog, setOpenAlertDialog] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [comment, setComment] = useState(originalText)

	const { data: user } = useQuery(['user', authorId], async () => fetchUser(authorId))

	const updateCommentMutation = useMutation(
		async () => {
			await updateComment({
				authorId,
				cardId,
				commentId: id,
				comment,
				userId
			})
			setIsEditing(false)
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

	return (
		<div className="w-full">
			<div className="flex flex-row items-center">
				<Image
					src={user?.image || ''}
					alt="user avatar"
					className="h-8 w-8 rounded-full object-cover mr-2"
					width={400}
					height={400}
				/>
				<div className="w-full relative flex items-start">
					<div className="flex flex-row justify-between items-start w-full">
						<div className="flex flex-col w-full">
							<div className="flex items-center justify-between h-3.5">
								<h2 className="text-xs font-medium">{user?.name}</h2>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<MoreHorizontal
											className="text-gray-500 hover:bg-gray-100 rounded-sm w-5 h-5"
											role="button"
										/>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											className="text-xs"
											role="button"
											onClick={() => setIsEditing(true)}
										>
											<PencilLine className="h-4 w-4 mr-2 text-gray-700" /> Edit Comment
										</DropdownMenuItem>

										<DropdownMenuItem
											className="text-xs"
											role="button"
											onClick={() => setOpenAlertDialog(true)}
										>
											<Trash2 className="h-4 w-4 mr-2 text-gray-700" />
											Delete Comment
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this comment
												from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 hover:bg-red-600"
												onClick={() => removeCommentMutation.mutate()}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
							<span className="text-[8px] text-gray-500">
								{new Date(updatedAt).toLocaleDateString('en-us', {
									month: 'short',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
									hour12: true
								})}
							</span>
						</div>
					</div>
				</div>
			</div>
			{isEditing ? (
				<>
					<input
						placeholder="Edit your comment..."
						className="w-full text-xs text-gray-900 pr-1.5 py-1.5 outline-none pl-10"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						autoFocus
						required
					/>
					<div className="flex justify-end mt-1">
						<XCircle
							role="button"
							className="text-gray-500 hover:text-gray-400 mr-1"
							onClick={() => setIsEditing(false)}
						/>
						<ArrowUpCircle
							role={`${comment.length > 0 ? 'button' : 'none'}`}
							className={`${comment.length > 0 ? 'text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
							onClick={() => {
								if (comment.length > 0) {
									updateCommentMutation.mutate()
									setIsEditing(false)
								}
							}}
						/>
					</div>
				</>
			) : (
				<p className="pl-10 text-xs text-gray-900">{comment}</p>
			)}
		</div>
	)
}
