import { findBoardById } from '@/app/server/boardsOperations'
import { getBoardMembers } from '@/app/server/membersOperations'
import { findUserById } from '@/app/server/usersOperations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { User } from '@/app/types'
import { AddButtonComponent } from '@/components/list-components/add-list'
import BoardHeader from '@/components/board-header'
import List from '@/components/list-components/list'

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
		<div className="mx-8">
			<BoardHeader
				{...board}
				author={author}
				currUserId={session.userId}
				members={members as User[]}
			/>
			<div className="w-full overflow-x-auto bg-[#fafbfe] px-2 rounded-lg mt-4">
				<div className="flex flex-row gap-8">
					<List members={members as User[]} boardId={board.id} />
					<List members={members as User[]} boardId={board.id} />
					<List members={members as User[]} boardId={board.id} />
					<AddButtonComponent name="list" boardId={board.id} />
				</div>
			</div>
		</div>
	)
}
