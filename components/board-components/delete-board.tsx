'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import DeleteItem from '../shared/delete-item'
import { deleteBoard } from '@/app/server/boardsOperations'
import { toast } from 'sonner'

export default function DeleteBoard({ boardId, boardAuthorId }: { boardId: string; boardAuthorId: string }) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session) return
			return await deleteBoard({ boardId, authorId: boardAuthorId, currUserId: session?.userId })
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['boards', session?.userId])
				toast.success('Board deleted successfully')
			}
		}
	)

	return (
		<DeleteItem
			deleteFn={() => mutate()}
			name="Board"
			dialogDescription="This action cannot be undone. This will permanently delete this board and all of its content."
			className="absolute right-2 text-gray-700 z-10"
			align="start"
		/>
	)
}
