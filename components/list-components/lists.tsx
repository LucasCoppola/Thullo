'use client'

import ListComponent from './list'
import AddButtonComponent from '../add-list-btn'

import { createPortal } from 'react-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getLists, updateListOrder } from '@/app/server/listsOperations'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useMemo, useState, useEffect } from 'react'
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { toast } from 'sonner'
import DraggableContainer from '../draggable-container'

import type { Card, List, User } from '@prisma/client'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { getAllBoardCards } from '@/app/server/card-operations/card'
import CardModal from '../card-components/card-modal'

export default function Lists({
	boardId,
	boardMembers,
	boardAuthorId
}: {
	boardId: string
	boardMembers: User[]
	boardAuthorId: string
}) {
	const { data: initialLists } = useQuery(['lists', boardId], async () => await getLists({ boardId }))
	const { data: initialCards } = useQuery(['board-cards', boardId], async () => await getAllBoardCards({ boardId }))
	const [listsState, setListsState] = useState<List[] | undefined>(initialLists)
	const [cardsState, setCardsState] = useState<Card[] | undefined>(initialCards)

	const [activeCard, setActiveCard] = useState<Card | null>(null)
	const [activeList, setActiveList] = useState<List | null>(null)

	const mutateListOrder = useMutation(
		async () => {
			if (listsState === initialLists) return
			if (!listsState) return

			const listOrder = listsState?.map((list) => ({
				id: list.id,
				position: list.position
			}))
			await updateListOrder({ boardId, listOrder })
		},
		{
			onError: (e: Error) => toast.error(e.message)
		}
	)

	const listsId = useMemo(() => {
		if (!listsState) return []
		return listsState.map((list) => list.id)
	}, [listsState])

	useEffect(() => {
		setListsState(initialLists)
	}, [initialLists])

	useEffect(() => {
		setCardsState(initialCards)
	}, [initialCards])

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current?.type === 'list') {
			setActiveList(e.active.data.current.list)
		}
		if (e.active.data.current?.type === 'card') {
			setActiveCard(e.active.data.current.card)
		}
	}

	function onDragEnd(e: DragEndEvent) {
		setActiveList(null)
		setActiveCard(null)

		const { active, over } = e
		if (!over) return

		const activeId = active.id
		const overId = over.id

		if (activeId === overId) return

		const isActiveList = active.data.current?.type === 'list'
		if (isActiveList) {
			setListsState((lists) => {
				if (!lists) return
				const updatedList = [...lists]
				const activeListIndex = updatedList.findIndex((list) => list.id === activeId)
				const overListIndex = updatedList.findIndex((list) => list.id === overId)

				// Reorder the List
				const [movedList] = updatedList.splice(activeListIndex, 1)
				updatedList.splice(overListIndex, 0, movedList!)

				return updatedList
			})
		}

		mutateListOrder.mutate()
	}

	function onDragOver(e: DragOverEvent) {
		const { active, over } = e
		if (!over) return

		const activeCardId = active.id
		const overId = over.id

		if (activeCardId === overId) return

		const isActiveCard = active.data.current?.type === 'card'
		const isOverCard = over.data.current?.type === 'card'

		if (!isActiveCard) return

		if (isActiveCard && isOverCard) {
			setCardsState((cards) => {
				if (!cards) return
				const updatedCards = [...cards]
				const activeIndex = cards.findIndex((card) => card.id === activeCardId)
				const overIndex = cards.findIndex((card) => card.id === overId)

				if (updatedCards[activeIndex]?.listId !== updatedCards[overIndex]?.listId) {
					updatedCards[activeIndex]!.listId = updatedCards[overIndex]!.listId
					updatedCards[activeIndex]!.position = overIndex
				}

				const [movedCard] = updatedCards.splice(activeIndex, 1)
				updatedCards.splice(overIndex, 0, movedCard!)

				return updatedCards
			})
		}

		const isOverList = over.data.current?.type === 'list'

		if (isActiveCard && isOverList) {
			setCardsState((cards) => {
				if (!cards) return
				const activeIndex = cards.findIndex((card) => card.id === activeCardId)
				cards[activeIndex]!.listId = overId as string

				return arrayMove(cards, activeIndex, activeIndex)
			})
		}
	}

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3
			}
		})
	)

	return (
		<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
			<DraggableContainer>
				<SortableContext items={listsId}>
					{listsState?.map(({ id, title }) => (
						<ListComponent
							key={id}
							listId={id}
							title={title}
							boardMembers={boardMembers}
							boardId={boardId}
							boardAuthorId={boardAuthorId}
							boardCards={cardsState || []}
						/>
					))}
				</SortableContext>
				<AddButtonComponent name="list" boardId={boardId} />
			</DraggableContainer>

			{typeof document !== 'undefined' &&
				createPortal(
					<DragOverlay>
						{activeList && (
							<ListComponent
								listId={activeList.id}
								title={activeList.title}
								boardMembers={boardMembers}
								boardId={boardId}
								boardAuthorId={boardAuthorId}
								boardCards={cardsState || []}
							/>
						)}
						{activeCard && (
							<CardModal
								card={activeCard}
								boardMembers={boardMembers}
								boardAuthorId={boardAuthorId}
								listId={activeCard.listId}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	)
}
