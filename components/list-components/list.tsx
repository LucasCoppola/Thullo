import { MoreHorizontal } from 'lucide-react'
import Card from '../card'
import { User } from '@/app/types'
import { AddButtonComponent, EditableListTitle } from './add-list'

export default function List({
	listId,
	members,
	boardId,
	title
}: {
	listId: string
	members: User[]
	boardId: string
	title: string
}) {
	return (
		<div className="mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row justify-between pb-4">
				<EditableListTitle title={title} listId={listId} />
				<MoreHorizontal className="text-gray-400" />
			</div>
			<Card members={members} />
			<AddButtonComponent name="card" boardId={boardId} />
		</div>
	)
}
