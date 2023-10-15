'use client'

import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'
import type { Card, User } from '@prisma/client'
import { findListById } from '@/app/server/listsOperations'
import Cards from '../card-components/cards'
import { useQuery } from '@tanstack/react-query'
import DeleteList from './delete-list'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function ListComponent({
	listId,
	boardMembers,
	boardId,
	title,
	boardAuthorId,
	boardCards
}: {
	listId: string
	boardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	boardId: string
	title: string
	boardAuthorId: string
	boardCards: Card[]
}) {
	const { data: list } = useQuery(['list', listId], async () => await findListById({ listId }))

	const listCards = boardCards?.filter((card) => card.listId === listId)

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: listId,
		data: {
			type: 'list',
			list
		}
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform)
	}

	return (
		<div
			ref={setNodeRef}
			className={`mt-4 bg-[#f8f9fa] px-1.5 pb-1.5 rounded-lg max-h-[75vh] ${isDragging && 'opacity-30'}`}
			style={{ width: '265px', ...style }}
		>
			<div className="flex flex-row items-center justify-between pb-4" {...attributes} {...listeners}>
				<EditableListTitle title={title} listId={listId} />
				<DeleteList
					listId={listId}
					boardAuthorId={boardAuthorId}
					listAuthorId={list?.authorId}
					boardId={boardId}
				/>
			</div>
			<div className="space-y-4 overflow-y-auto max-h-96 overflow-x-hidden pb-2 pr-0.5">
				<Cards
					listId={listId}
					listTitle={list?.title || undefined}
					boardMembers={boardMembers}
					boardAuthorId={boardAuthorId}
					listCards={listCards}
				/>
			</div>

			<AddButtonComponent name="card" boardId={boardId} listId={listId} />
		</div>
	)
}
