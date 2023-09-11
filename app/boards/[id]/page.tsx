import { findBoardById, getLists } from '@/app/server/boardsOperations'
import { getBoardMembers } from '@/app/server/membersOperations'
import { findUserById } from '@/app/server/usersOperations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import type { Board, User } from '@prisma/client'
import BoardHeader from '@/components/board-header'
import List from '@/components/list-components/list'
import AddButtonComponent from '@/components/add-list-btn'

export default async function BoardPage({
	params
}: {
	params: { id: string }
}) {
	const { id } = params
	const { board } = await findBoardById({ id })

	if (!board) return <div>No board found</div>

	const session = await getServerSession(authOptions)
	const { author } = await findUserById({ id: board.authorId })
	const { members } = await getBoardMembers({ boardId: id })
	const { lists } = await getLists({ boardId: id })

	if (!session) {
		redirect('/')
	}

	return (
		<div className="mx-8">
			<BoardHeader
				{...(board as Board)}
				author={author as User}
				currUserId={session.userId}
				members={members as User[]}
			/>
			<div className="w-full overflow-x-auto bg-[#fafbfe] px-2 rounded-lg mt-4">
				<div className="flex flex-row gap-8">
					{lists?.map(({ id, title }) => (
						<List
							key={id}
							listId={id}
							title={title}
							members={members as User[]}
							boardId={board.id}
						/>
					))}

					<AddButtonComponent
						name="list"
						boardId={board.id}
						listId={id}
					/>
				</div>
			</div>
		</div>
	)
}
