import { MoreHorizontal } from 'lucide-react'
import Card from '../card-components/card'
import { EditableListTitle } from './add-list'
import AddButtonComponent from '../add-list-btn'
import { getCards } from '@/app/server/cardOperations'
import type { List, User } from '@prisma/client'
import { findListById } from '@/app/server/boardsOperations'

export default async function List({
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
	const { cards } = await getCards({ listId })
	const { list } = await findListById({ listId })

	return (
		<div className="mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row justify-between pb-4">
				<EditableListTitle title={title} listId={listId} />
			</div>
			<div className="space-y-4">
				{cards?.map((card) => (
					<Card
						key={card.id}
						members={members}
						card={card}
						list={list as List}
					/>
				))}
			</div>

			<AddButtonComponent name="card" boardId={boardId} listId={listId} />
		</div>
	)
}
