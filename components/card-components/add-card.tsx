import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCard } from '@/app/server/card-operations/card'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function AddCard({ setCreateMode, listId }: { setCreateMode: (val: boolean) => void; listId: string }) {
	const { data: session } = useSession()
	const [cardTitle, setCardTitle] = useState('')
	const queryClient = useQueryClient()

	const isCardTitleValid = cardTitle.trim().length >= 1

	const { mutate: mutateCardTitle, isLoading } = useMutation(
		async () => {
			if (!session) return

			return await createCard({
				listId,
				title: cardTitle,
				authorId: session.userId
			})
		},
		{
			onSuccess: () => {
				toast.success('Card created')
				queryClient.invalidateQueries(['cards', listId])
				setCreateMode(false)
			},
			onError: (e: Error) => {
				console.error(e)
				toast.error(e.message)
			},
			onSettled: () => setCardTitle('')
		}
	)
	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			className="mt-4 bg-blue-50 items-center px-2.5 py-2 rounded-md h-20"
			style={{ minWidth: '243px' }}
		>
			<input
				type="text"
				placeholder="Enter card title..."
				className="border-2 border-blue-200 px-2 py-0.5 mb-1 rounded-sm focus:outline-none"
				value={cardTitle}
				onChange={(e) => setCardTitle(e.target.value)}
				disabled={isLoading}
				required
				autoFocus
			/>
			<div className="flex flex-row gap-2 mt-0.5">
				<button
					className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
					onClick={() => {
						if (isCardTitleValid) mutateCardTitle()
					}}
					disabled={isLoading}
				>
					Add Card
				</button>
				<button className="text-sm text-gray-600" onClick={() => setCreateMode(false)}>
					Cancel
				</button>
			</div>
		</form>
	)
}
