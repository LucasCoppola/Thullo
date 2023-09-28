import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeCard } from '@/app/server/card-operations/card'
import { useSession } from 'next-auth/react'
import DeleteItem from '../shared/delete-item'

export default function DeleteCard({
	cardId,
	cardAuthorId,
	listId
}: {
	cardId: string
	cardAuthorId: string
	listId: string
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session) return
			return await removeCard({ authorId: cardAuthorId, cardId, userId: session.userId })
		},
		{
			onSuccess: () => {
				console.log('card removed')
				queryClient.invalidateQueries(['cards', listId])
			}
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
