'use client'

import type { Card, User } from '@prisma/client'
import CardModal from './card-modal'
import { useQuery } from '@tanstack/react-query'
import { getCards } from '@/app/server/card-operations/card'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useEffect, useMemo, useState } from 'react'
import { DndContext, useSensors, useSensor, PointerSensor, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core'
import { createPortal } from 'react-dom'

export default function Cards({
	listId,
	listTitle,
	boardMembers,
	boardAuthorId
}: {
	listId: string
	listTitle: string | undefined
	boardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	boardAuthorId: string
}) {
	const { data: initialCards } = useQuery(['cards', listId], async () => await getCards({ listId }))
	const [cardsState, setCardsState] = useState<Card[] | undefined>(initialCards)
	const [activeCard, setActiveCard] = useState<Card | null>(null)

	useEffect(() => {
		setCardsState(initialCards)
	}, [initialCards])

	const cardsId = useMemo(() => {
		if (!cardsState) return []
		return cardsState.map((card) => card.id) as (UniqueIdentifier | { id: UniqueIdentifier })[]
	}, [cardsState])

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current?.type === 'card') {
			setActiveCard(e.active.data.current.card)
		}
	}

	function onDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over) return

		const activeCardId = active.id
		const overCardId = over.id

		if (activeCardId === overCardId) return

		setCardsState((cards) => {
			if (!cards) return cards

			const activeCardsIdx = cards.findIndex((list) => list.id === activeCardId)
			const overCardsIdx = cards.findIndex((list) => list.id === overCardId)

			return arrayMove(cards, activeCardsIdx, overCardsIdx)
		})

		// mutateListOrder.mutate()
	}

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3
			}
		})
	)

	return (
		<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<SortableContext items={cardsId}>
				{cardsState?.map((card) => (
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

			{typeof document !== 'undefined' &&
				createPortal(
					<DragOverlay>
						{activeCard && (
							<CardModal
								key={activeCard.id}
								card={activeCard}
								boardMembers={boardMembers}
								boardAuthorId={boardAuthorId}
								listId={listId}
								listTitle={listTitle!}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	)
}
