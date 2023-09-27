import BoardCard from '@/components/board-card'
import CreateBoard from '@/components/create-board'
import { getBoards } from '@/app/server/boardsOperations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import type { Board } from '@prisma/client'

export default async function Boards() {
	const session = await getServerSession(authOptions)
	const userId = session?.userId || ''
	const boards = await getBoards({ userId })

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="mx-24">
			<div className="flex justify-between w-full mt-14 mb-6">
				<h1 className="text-lg font-medium text-gray-800">All Boards</h1>
				<CreateBoard />
			</div>
			<div className="flex flex-wrap gap-9">
				{JSON.parse(JSON.stringify(boards)).map((board: Board) => (
					<BoardCard key={board.id} {...board} />
				))}
			</div>
		</div>
	)
}
