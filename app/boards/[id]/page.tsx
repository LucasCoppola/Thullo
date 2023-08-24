import { findBoardById, findUserById } from '@/app/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import BoardHeader from './board-header'

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
	if (!session) {
		redirect('/')
	}

	return (
		<BoardHeader {...board} author={author} currUserId={session.userId} />
	)
}
