'use client'

import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'
import type { User } from '@prisma/client'
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
	boardAuthorId
}: {
	listId: string
	boardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	boardId: string
	title: string
	boardAuthorId: string
}) {
	const { data: list } = useQuery(['list', listId], async () => await findListById({ listId }))

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

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={{
					width: '256px',
					...style
				}}
				className="mt-4 px-1.5 pb-1.5 bg-[#e2e8f0] opacity-50 rounded-lg border border-blue-400 border-dashed h-screen"
			></div>
		)
	}

	return (
		<div
			ref={setNodeRef}
			className="mt-4 bg-[#f8f9fa] px-1.5 pb-1.5 rounded-lg"
			style={{ width: '256px', ...style }}
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
			<div className="space-y-4">
				<Cards
					listId={listId}
					listTitle={list?.title || undefined}
					boardMembers={boardMembers}
					boardAuthorId={boardAuthorId}
				/>
			</div>

			<AddButtonComponent name="card" boardId={boardId} listId={listId} />
		</div>
	)
}
