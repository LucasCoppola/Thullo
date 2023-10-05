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

import type { List, User } from '@prisma/client'
import type { DragStartEvent, UniqueIdentifier, DragEndEvent } from '@dnd-kit/core'

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
	const [listsState, setListsState] = useState<List[] | undefined>(initialLists)
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
			onSuccess: () => toast.success('List positions updated'),
			onError: (e: Error) => toast.error(e.message)
		}
	)

	const listsId = useMemo(() => {
		if (!listsState) return []
		return listsState.map((list) => list.id) as (UniqueIdentifier | { id: UniqueIdentifier })[]
	}, [listsState])

	useEffect(() => {
		setListsState(initialLists)
	}, [initialLists])

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current?.type === 'list') {
			setActiveList(e.active.data.current.list)
		}
	}

	function onDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over) return

		const activeListId = active.id
		const overListId = over.id

		if (activeListId === overListId) return

		setListsState((lists) => {
			if (!lists) return lists

			const activeListIdx = lists.findIndex((list) => list.id === activeListId)
			const overListIdx = lists.findIndex((list) => list.id === overListId)

			return arrayMove(lists, activeListIdx, overListIdx)
		})

		mutateListOrder.mutate()
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
			<div className="flex flex-row gap-8">
				{listsState?.map(({ id, title }) => (
					<SortableContext items={listsId} key={id}>
						<ListComponent
							key={id}
							listId={id}
							title={title}
							boardMembers={boardMembers}
							boardId={boardId}
							boardAuthorId={boardAuthorId}
						/>
					</SortableContext>
				))}
				<AddButtonComponent name="list" boardId={boardId} />
			</div>

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
							/>
						)}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	)
}
