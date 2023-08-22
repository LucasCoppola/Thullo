'use client'

import { Button } from '@/components/ui/button'
import { Lock, MoreHorizontal } from 'lucide-react'
import { Add, Globe } from '@/components/ui/icons'
import { $Enums } from '@prisma/client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const avatars = [
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' }
]
export default function BoardHeader({
	visibility
}: {
	visibility: $Enums.BoardVisibility
}) {
	return (
		<div className="mt-8 mx-8 flex justify-between items-center">
			<div className="flex space-x-4 flex-row items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-9 mr-2">
							{visibility === 'PUBLIC' ? (
								<Globe
									className="h-3 w-3.5 mr-1"
									color="#6b7280"
								/>
							) : (
								<Lock
									className="h-3 w-3.5 text-gray-500 mr-1"
									strokeWidth={2.5}
								/>
							)}
							{visibility[0]?.concat(
								visibility.slice(1).toLowerCase()
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
						<DropdownMenuItem>Team</DropdownMenuItem>
						<DropdownMenuItem>Subscription</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

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
				className="flex items-center justify-center w-8 h-7 rounded-md hover:bg-gray-200 transition duration-200"
			>
				<MoreHorizontal />
			</div>
		</div>
	)
}
