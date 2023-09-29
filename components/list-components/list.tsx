'use client'

import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'
import type { List, User } from '@prisma/client'
import { findListById } from '@/app/server/listsOperations'
import Cards from '../card-components/cards'
import { useQuery } from '@tanstack/react-query'
import DeleteList from './delete-list'

export default function List({
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

	return (
		<div className="mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row items-center justify-between pb-4">
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
