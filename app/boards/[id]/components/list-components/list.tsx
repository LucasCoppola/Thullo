import { MoreHorizontal } from 'lucide-react'
import Card from '../card'
import { User } from '@/app/types'
import { AddButtonComponent } from './add-list'

export default function List({
	members,
	boardId
}: {
	members: User[]
	boardId: string
}) {
	return (
		<div className="mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row justify-between pb-4">
				<h2 className="text-gray-800 font-medium">List Title</h2>
				<MoreHorizontal className="text-gray-400" />
			</div>
			<Card members={members} />
			<AddButtonComponent name="card" boardId={boardId} />
		</div>
	)
}
