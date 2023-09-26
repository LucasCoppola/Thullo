'use client'

import { useQuery } from '@tanstack/react-query'
import { getLists } from '@/app/server/boardsOperations'
import List from './list'
import type { User } from '@prisma/client'

export default function Lists({
	boardId,
	boardMembers,
	boardAuthorId
}: {
	boardId: string
	boardMembers: User[]
	boardAuthorId: string | undefined
}) {
	const { data: lists } = useQuery(['lists', boardId], async () => await getLists({ boardId }))

	return (
		<>
			{lists?.map(({ id, title }) => (
				<List
					key={id}
					listId={id}
					title={title}
					boardMembers={boardMembers}
					boardId={boardId}
					boardAuthorId={boardAuthorId}
				/>
			))}
		</>
	)
}
