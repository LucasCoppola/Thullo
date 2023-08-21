import findBoardById, { BoardProps } from '@/app/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Lock, MoreHorizontal } from 'lucide-react'
import { Add, Globe } from '@/components/ui/icons'
import { $Enums } from '@prisma/client'

export default async function Board({ params }: { params: { id: string } }) {
	const { id } = params
	const { board } = await findBoardById({ id })
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/')
	}

	return <BoardHeader visibility={board!.visibility} />
}

function BoardHeader({ visibility }: { visibility: $Enums.BoardVisibility }) {
	const avatars = [
		{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
		{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
		{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
		{ img: 'https://github.com/shadcn.png', name: 'shadcn' }
	]
	return (
		<div className="mt-8 mx-8 flex justify-between items-center">
			<div className="flex space-x-4 flex-row items-center">
				<Button className="h-9 mr-2">
					{visibility === 'PUBLIC' ? (
						<Globe className="h-3 w-3.5 mr-1" color="#6b7280" />
					) : (
						<Lock
							className="h-3 w-3.5 text-gray-500 mr-1"
							strokeWidth={2.5}
						/>
					)}
					{visibility[0]?.concat(visibility.slice(1).toLowerCase())}
				</Button>
				{avatars.slice(0, 3).map(({ img, name }, i) => (
					<img
						key={i}
						src={img}
						alt={`${name} avatar`}
						title={name}
						className="w-8 h-8 rounded-lg"
					/>
				))}
				<Button size="icon" className="h-8 w-8" title="Add a member">
					<Add className="h-[19px] w-[19px] text-gray-500" />
				</Button>
			</div>
			<div
				role="button"
				title="Show Menu"
				className="flex items-center justify-center w-8 h-7 rounded-md hover:bg-gray-200"
			>
				<MoreHorizontal />
			</div>
		</div>
	)
}
