'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import DeleteItem from '../delete-item'
import { deleteBoard } from '@/app/server/boardsOperations'
import { toast } from 'sonner'

export default function DeleteBoard({ boardId, boardAuthorId }: { boardId: string; boardAuthorId: string }) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const isAuthor = boardAuthorId === session?.userId

	const { mutate } = useMutation(
		async () => {
			if (!session) return

			return await deleteBoard({
				boardId,
				authorId: boardAuthorId,
				currUserId: session.userId,
				leaveOnly: !isAuthor
			})
		},
		{
			onSuccess: () => toast.success(isAuthor ? 'Board deleted successfully.' : 'You have left the board.'),
			onError: (e: Error) => toast.error(e.message),
			onSettled: () => queryClient.invalidateQueries(['boards', session?.userId])
		}
	)

	return (
		<DeleteItem
			deleteFn={() => mutate()}
			name="Board"
			dialogDescription={`${
				isAuthor
					? 'This action cannot be undone. This will permanently delete this board and all of its content.'
					: 'This action cannot be undone. This will remove you from this board'
			} `}
			className="absolute right-2 text-gray-700 z-10"
			align="start"
		/>
	)
}
