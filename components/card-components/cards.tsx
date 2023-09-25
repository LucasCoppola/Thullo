'use client'

import type { User, List } from '@prisma/client'
import CardModal from './card-modal'
import { useQuery } from '@tanstack/react-query'
import { getCards } from '@/app/server/card-operations/card'

export default function Cards({ list, boardMembers }: { list: List; boardMembers: User[] }) {
	const { data: cards } = useQuery(['cards'], async () => await getCards({ listId: list.id }))
	return (
		<>
			{cards?.map((card) => (
				<CardModal key={card.id} card={card} boardMembers={boardMembers} list={list} />
			))}
		</>
	)
}
