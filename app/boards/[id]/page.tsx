import findBoardById from '@/app/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function Board({ params }: { params: { id: string } }) {
	const { id } = params
	const board = await findBoardById({ id })
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/')
	}

	return (
		<div>
			<h1>My {JSON.stringify(board)}</h1>
		</div>
	)
}
