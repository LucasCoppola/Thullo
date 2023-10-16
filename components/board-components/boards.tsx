'use client'

import { useQuery } from '@tanstack/react-query'
import { getBoards } from '@/app/server/boardsOperations'
import BoardCard from './board-card'
import type { Board } from '@prisma/client'
import SkeletonBoardCard from '../loading/skeleton-board-card'

export default function Boards({ userId }: { userId: string }) {
	const { data: boards, isLoading } = useQuery(['boards', userId], async () => await getBoards({ userId }))

	return (
		<div className="flex flex-wrap gap-9">
			{isLoading
				? Array(3)
						.fill(null)
						.map((_, i) => (
							<div key={i}>
								<SkeletonBoardCard />
							</div>
						))
				: boards?.map((board: Board) => <BoardCard key={board.id} {...board} />)}
		</div>
	)
}
