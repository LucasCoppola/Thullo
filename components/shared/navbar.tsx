'use client'

import UserDropdown from './user-dropdown'
import Image from 'next/image'
import Link from 'next/link'
import { findBoardById } from '@/app/server/boardsOperations'
import type { Session } from 'next-auth'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from '@/components/ui/command'

export default function Navbar({ session }: { session: Session | null }) {
	const pathname = usePathname()
	const boardId = pathname.split('/').pop() as string
	const [openSearchDialog, setOpenSearchDialog] = useState(false)

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
							{pathname !== '/' && (
								<>
									<div className="relative mr-20 flex" onClick={() => setOpenSearchDialog(true)}>
										<input
											type="button"
											className="pl-9 py-2 text-gray-500 text-sm bg-white border border-gray-300 rounded-lg text-left"
											style={{ width: '16rem' }}
											value="Search..."
										/>
										<span className="absolute inset-y-0 left-0 flex items-center pl-3">
											<Search className="h-4 w-4 text-gray-500" />
										</span>
									</div>
									<CommandDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
										<CommandInput placeholder="Type a command or search..." />
										<CommandList>
											<CommandEmpty>No results found.</CommandEmpty>
											<CommandGroup heading="Suggestions">
												<CommandItem>Calendar</CommandItem>
												<CommandItem>Search Emoji</CommandItem>
												<CommandItem>Calculator</CommandItem>
											</CommandGroup>
											<CommandSeparator />
											<CommandGroup heading="Settings">
												<CommandItem>Profile</CommandItem>
												<CommandItem>Billing</CommandItem>
												<CommandItem>Settings</CommandItem>
											</CommandGroup>
										</CommandList>
									</CommandDialog>
								</>
							)}
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
