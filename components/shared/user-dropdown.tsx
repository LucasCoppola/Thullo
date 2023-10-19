import Image from 'next/image'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export default function UserDropdown({ session }: { session: Session }) {
	const [isOpen, setIsOpen] = useState(false)

	if (!session.user?.email) return null

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<button
					className="flex items-center outline-none text-sm font-semibold text-gray-800 rounded-full md:mr-0 focus:ring-gray-100"
					onClick={() => setIsOpen(!isOpen)}
				>
					<Image
						src={session.user.image || ''}
						className="md:mr-3 object-cover h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
						alt="avatar"
						width={400}
						height={400}
					/>
					<span className="hidden md:block">{session.user.name}</span>
					<svg
						className={`w-2.5 h-2.5 ml-3 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 10 6"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m1 1 4 4 4-4"
						/>
					</svg>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel className="py-2 text-sm text-gray-600">
					<h2 className="truncate">{session.user.email}</h2>{' '}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						signOut({ redirect: true, callbackUrl: '/' })
						toast('You have been logged out.')
					}}
				>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
