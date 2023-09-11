import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createCard } from '@/app/server/cardOperations'
import { useSession } from 'next-auth/react'

export default function AddCard({
	setCreateMode,
	listId
}: {
	setCreateMode: (val: boolean) => void
	listId: string
}) {
	const [cardTitle, setCardTitle] = useState('')
	const isCardTitleValid = cardTitle.trim().length >= 1
	const { data: session } = useSession()

	const { mutate: mutateCardTitle, isLoading } = useMutation(
		async () =>
			await createCard({
				listId,
				title: cardTitle,
				authorId: session?.userId!
			}),
		{
			onSuccess: () => {
				console.log('Card created')
				setCreateMode(false)
			},
			onError: (e) => {
				console.error(e)
			}
		}
	)
	return (
		<form
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
				<button
					className="text-sm text-gray-600"
					onClick={() => setCreateMode(false)}
				>
					Cancel
				</button>
			</div>
		</form>
	)
}
