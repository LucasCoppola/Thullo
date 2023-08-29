import { findBoardById, findUserById, getBoardMembers } from '@/app/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import BoardHeader from './components/board-header'
import { User } from '@/app/types'

export default async function BoardPage({
	params
}: {
	params: { id: string }
}) {
	const { id } = params
	const { board } = await findBoardById({ id })

	if (!board) return <div>No board found</div>

	const { author } = await findUserById({ id: board.authorId })
	const session = await getServerSession(authOptions)
	const { members } = await getBoardMembers({ boardId: id })
	if (!session) {
		redirect('/')
	}

	return (
		<BoardHeader
			{...board}
			author={author}
			currUserId={session.userId}
			members={members as User[]}
		/>
	)
}
