'use client'

import UserDropdown from './user-dropdown'
import Image from 'next/image'
import Link from 'next/link'
import { findBoardById } from '@/app/server/boardsOperations'
import type { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useQuery } from '@tanstack/react-query'

import SearchBoardModal from '../search-board-modal'

export default function Navbar({ session }: { session: Session | null }) {
	const pathname = usePathname()
	const boardId = pathname.split('/').pop() as string

	const { data: board } = useQuery(['board', boardId], async () => await findBoardById({ id: boardId }))

	return (
		<nav className="z-10 relative bg-transparent mt-1 px-10 shadow-sm">
			<div className="w-full py-2 md:flex md:justify-between items-center">
				<div className="flex items-center">
					<Link href="/">
						<Image className="w-auto h-6 sm:h-7" src="./Logo.svg" alt="Logo" width={400} height={400} />
					</Link>
				</div>

				{board && (
					<div className="flex flex-row items-center">
						<div className="ml-4 font-medium text-lg text-gray-800">{board?.title}</div>
						<div className="mx-6 border-r border-gray-200 h-9" />
						<Link href="/boards">
							<Button variant="gray">All Boards</Button>
						</Link>
					</div>
				)}

				<div className="flex">
					{session ? (
						<>
							{pathname !== '/' && <SearchBoardModal userId={session.userId} />}
							<UserDropdown session={session} />
						</>
					) : (
						<Link href="/login">
							<Button className="rounded-lg">Sign In</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}
