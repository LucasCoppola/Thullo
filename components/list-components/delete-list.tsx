import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { removeList } from '@/app/server/listsOperations'
import DeleteItem from '../delete-item'
import { toast } from 'sonner'

export default function DeleteList({
	listId,
	boardId,
	boardAuthorId,
	listAuthorId
}: {
	listId: string
	boardId: string
	boardAuthorId: string | undefined
	listAuthorId: string | undefined
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session || !boardAuthorId || !listAuthorId) return
			return await removeList({ boardAuthorId, listAuthorId, listId, userId: session.userId })
		},
		{
			onSuccess: () => {
				toast.success('List deleted')
				queryClient.invalidateQueries(['lists', boardId])
			},
			onError: (e: Error) => toast.error(e.message)
		}
	)

	return (
		<DeleteItem
			name="List"
			dialogDescription="This action cannot be undone. This will permanently delete this list and all of its cards and content."
			deleteFn={mutate}
			align="start"
		/>
	)
}
