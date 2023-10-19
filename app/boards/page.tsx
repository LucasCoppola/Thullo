import CreateBoard from '@/components/board-components/create-board'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import Boards from '@/components/board-components/boards'

export default async function BoardsPage() {
	const session = await getServerSession(authOptions)

	if (!session) redirect('/login')
	const userId = session.userId

	return (
		<div className="mx-6 md:mx-24">
			<div className="flex justify-between w-full mt-14 mb-6">
				<h1 className="text-lg font-medium text-gray-800">All Boards</h1>
				<CreateBoard />
			</div>

			<Boards userId={userId} />
		</div>
	)
}
