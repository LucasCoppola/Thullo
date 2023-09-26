'use client'

import type { User } from '@prisma/client'
import CardModal from './card-modal'
import { useQuery } from '@tanstack/react-query'
import { getCards } from '@/app/server/card-operations/card'

export default function Cards({
	listId,
	listTitle,
	boardMembers
}: {
	listId: string
	listTitle: string | undefined
	boardMembers: User[]
}) {
	const { data: cards } = useQuery(['cards', listId], async () => await getCards({ listId }))

	return (
		<>
			{cards?.map((card) => (
				<CardModal
					key={card.id}
					card={card}
					boardMembers={boardMembers}
					listId={listId}
					listTitle={listTitle!}
				/>
			))}
		</>
	)
}
