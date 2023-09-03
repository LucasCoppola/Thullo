import { findBoardById } from '@/app/server/boardsOperations'
import { getBoardMembers } from '@/app/server/membersOperations'
import { findUserById } from '@/app/server/usersOperations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import BoardHeader from './components/board-header'
import { User } from '@/app/types'
import List from './components/list'
import { Add } from '@/components/ui/icons'

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
			<div className="w-full overflow-x-auto bg-[#fafbfe] px-8 rounded-lg mt-4">
				<div className="flex flex-row gap-8">
					<List members={members as User[]} />
					<List members={members as User[]} />
					<List members={members as User[]} />
					<AddButtonComponent name="list" />
				</div>
			</div>
		</div>
	)
}

export function AddButtonComponent({ name }: { name: 'card' | 'list' }) {
	return (
		<button
			className="mt-4 flex flex-row bg-blue-50 h-8 items-center px-2.5 py-1 rounded-lg hover:bg-blue-100"
			style={{ minWidth: '243px' }}
		>
			<span className="text-blue-400 text-sm">Add another {name}</span>
			<Add className="text-blue-300 ml-auto w-5 h-5" strokeWidth={1.5} />
		</button>
	)
}
