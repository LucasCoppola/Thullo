import BoardCard from '@/components/ui/board-card'
import CreateBoard from '../../components/boards/create-board'
import { BoardProps, getBoards } from '@/app/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function Boards() {
	const session = await getServerSession(authOptions)
	const userId = session?.userId || ''
	const boards = await getBoards({ userId })

	if (!session) {
		redirect('/')
		return
	}

	return (
		<>
			<div className="flex justify-between w-full mt-14 mb-6">
				<h1 className="text-lg font-medium text-gray-800">
					All Boards
				</h1>
				<CreateBoard />
			</div>
			<div className="flex flex-wrap gap-9">
				{JSON.parse(JSON.stringify(boards)).map((board: BoardProps) => (
					<BoardCard key={board.id} {...board} />
				))}
			</div>
		</>
	)
}
