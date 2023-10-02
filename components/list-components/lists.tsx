'use client'

import { useQuery } from '@tanstack/react-query'
import { getLists } from '@/app/server/listsOperations'
import ListComponent from './list'
import { SortableContext } from '@dnd-kit/sortable'
import type { List, User } from '@prisma/client'
import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, type DragStartEvent, type UniqueIdentifier } from '@dnd-kit/core'
import AddButtonComponent from '../add-list-btn'
import { createPortal } from 'react-dom'

export default function Lists({
	boardId,
	boardMembers,
	boardAuthorId
}: {
	boardId: string
	boardMembers: User[]
	boardAuthorId: string
}) {
	const { data: lists } = useQuery(['lists', boardId], async () => await getLists({ boardId }))
	const [activeColumn, setActiveColumn] = useState<List | null>(null)

	const listsId = useMemo(() => {
		if (!lists) return []
		return lists.map((list) => list.id) as (UniqueIdentifier | { id: UniqueIdentifier })[]
	}, [lists])

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current?.type === 'list') {
			setActiveColumn(e.active.data.current.list)
		}
	}

	return (
		<DndContext onDragStart={onDragStart}>
			<div className="flex flex-row gap-8">
				<SortableContext items={listsId}>
					{lists?.map(({ id, title }) => (
						<ListComponent
							key={id}
							listId={id}
							title={title}
							boardMembers={boardMembers}
							boardId={boardId}
							boardAuthorId={boardAuthorId}
						/>
					))}
				</SortableContext>
				<AddButtonComponent name="list" boardId={boardId} />
			</div>

			{createPortal(
				<DragOverlay>
					{activeColumn && (
						<ListComponent
							listId={activeColumn.id}
							title={activeColumn.title}
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
