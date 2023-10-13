'use client'

import type { Card, User } from '@prisma/client'
import CardModal from './card-modal'
import { SortableContext } from '@dnd-kit/sortable'
import { useMemo } from 'react'

export default function Cards({
	listId,
	listTitle,
	boardMembers,
	boardAuthorId,
	listCards
}: {
	listId: string
	listTitle: string | undefined
	boardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	boardAuthorId: string
	listCards?: Card[]
}) {
	const cardsId = useMemo(() => {
		if (!listCards) return []
		return listCards.map((card) => card.id)
	}, [listCards])

	return (
		<SortableContext items={cardsId}>
			{listCards?.map((card) => (
				<CardModal
					key={card.id}
					card={card}
					boardMembers={boardMembers}
					boardAuthorId={boardAuthorId}
					listId={listId}
					listTitle={listTitle!}
				/>
			))}
		</SortableContext>
	)
}
