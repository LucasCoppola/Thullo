import { useState } from 'react'
import EditableTitle from '../editable-title'
import { useMutation } from '@tanstack/react-query'
import { updateCardTitle } from '@/app/server/card-operations/card'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function CardTitle({
	cardTitle,
	cardId,
	authorId
}: {
	cardTitle: string
	cardId: string
	authorId: string
}) {
	const { data: session } = useSession()
	const [title, setTitle] = useState(cardTitle)

	const { mutate: mutateCardTitle } = useMutation(
		async () => {
			if (!session) return
			return await updateCardTitle({ authorId, cardId, title, userId: session?.userId })
		},
		{
			onSuccess: () => toast.success('Card title updated'),
			onError: (e) => toast.error((e as Error).message)
		}
	)
	return (
		<>
			<EditableTitle
				initialValue={title}
				titleClassName="py-0.5 hover:bg-gray-100 rounded-sm font-medium"
				inputClassName="px-0.5"
				onSave={(editedTitle) => {
					if (editedTitle.trim().length === 0) return
					setTitle(editedTitle)
					mutateCardTitle()
				}}
			/>
		</>
	)
}
