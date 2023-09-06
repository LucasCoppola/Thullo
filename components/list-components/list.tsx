import { MoreHorizontal } from 'lucide-react'
import Card from '../card-components/card'
import { User } from '@/app/types'
import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'

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
			</div>
			<Card members={members} />
			<AddButtonComponent name="card" boardId={boardId} />
		</div>
	)
}
