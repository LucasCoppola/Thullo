'use client'

import { useQuery } from '@tanstack/react-query'
import { getBoards } from '@/app/server/boardsOperations'
import BoardCard from './board-card'
import type { Board } from '@prisma/client'

export default function Boards({ userId }: { userId: string }) {
	const { data: boards } = useQuery(['boards', userId], async () => await getBoards({ userId }))

	return (
		<div className="flex flex-wrap gap-9">
			{boards?.map((board: Board) => (
				<BoardCard key={board.id} {...board} />
			))}
		</div>
	)
}
