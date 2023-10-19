'use client'

import { useQuery } from '@tanstack/react-query'
import { getBoards } from '@/app/server/boardsOperations'
import BoardCard from './board-card'
import type { Board } from '@prisma/client'
import SkeletonBoardCard from '../loading/skeleton-board-card'
import Image from 'next/image'

export default function Boards({ userId }: { userId: string }) {
	const { data: boards, isLoading } = useQuery(['boards', userId], async () => await getBoards({ userId }))

	return (
		<>
			{!boards && !isLoading ? (
				<Image
					className="w-full text-center h-96"
					src="./no-boards.svg"
					alt="Empty boards page"
					width={400}
					height={400}
				/>
			) : (
				<div className="flex justify-center flex-wrap gap-6 md:gap-9 last:mb-6 md:last:mb-0">
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
			)}
		</>
	)
}
