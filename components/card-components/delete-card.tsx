import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeCard } from '@/app/server/card-operations/card'
import { useSession } from 'next-auth/react'
import DeleteItem from '../shared/delete-item'
import { toast } from 'sonner'

export default function DeleteCard({
	cardId,
	cardAuthorId,
	boardAuthorId,
	listId
}: {
	cardId: string
	cardAuthorId: string
	boardAuthorId: string
	listId: string
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session) return
			return await removeCard({ cardAuthorId, boardAuthorId, cardId, userId: session.userId })
		},
		{
			onSuccess: () => {
				toast.success('Card deleted')
				queryClient.invalidateQueries(['cards', listId])
			},
			onError: (e: Error) => toast.error(e.message)
		}
	)

	return (
		<DeleteItem
			name="Card"
			deleteFn={() => mutate()}
			dialogDescription="This action cannot be undone. This will permanently delete this card and all of its content from our servers."
			align="start"
			className="absolute right-2 text-gray-700"
		/>
	)
}
