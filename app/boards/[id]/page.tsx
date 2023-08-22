import findBoardById from '@/app/server'
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
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/')
	}

	return <BoardHeader visibility={board!.visibility} />
}
