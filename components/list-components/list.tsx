import { MoreHorizontal } from 'lucide-react'
import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'
import type { List, User } from '@prisma/client'
import { findListById } from '@/app/server/boardsOperations'
import Cards from '../card-components/cards'

export default async function List({
	listId,
	boardMembers,
	boardId,
	title
}: {
	listId: string
	boardMembers: User[]
	boardId: string
	title: string
}) {
	const { list } = await findListById({ listId })

	return (
		<div className="mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row justify-between pb-4">
				<EditableListTitle title={title} listId={listId} />
			</div>
			<div className="space-y-4">
				<Cards list={list as List} boardMembers={boardMembers} />
			</div>

			<AddButtonComponent name="card" boardId={boardId} listId={listId} />
		</div>
	)
}
