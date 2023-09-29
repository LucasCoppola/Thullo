'use client'

import { useQuery } from '@tanstack/react-query'
import { getLists } from '@/app/server/listsOperations'
import List from './list'
import { getBoardMembers } from '@/app/server/membersOperations'

export default function Lists({ boardId, boardAuthorId }: { boardId: string; boardAuthorId: string | undefined }) {
	const { data: lists } = useQuery(['lists', boardId], async () => await getLists({ boardId }))
	const { data: members } = useQuery(['board-members', boardId], async () => await getBoardMembers({ boardId }))

	return (
		<>
			{lists?.map(({ id, title }) => (
				<List
					key={id}
					listId={id}
					title={title}
					boardMembers={members}
					boardId={boardId}
					boardAuthorId={boardAuthorId}
				/>
			))}
		</>
	)
}
