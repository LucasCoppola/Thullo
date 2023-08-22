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
	{
		img: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		name: 'Juan'
	},
	{
		img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
		name: 'Esteban'
	},
	{
		img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		name: 'John'
	},
	{
		img: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		name: 'Carla'
	}
]

export default function BoardHeader({
	visibility
}: {
	visibility: $Enums.BoardVisibility
}) {
	return (
		<div className="mt-6 mx-8 flex justify-between items-center">
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
						<DropdownMenuLabel>
							<h2>Visibility</h2>
							<span className="text-gray-500 text-xs">
								Choose who can see this board.
							</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="cursor-pointer flex-col items-start">
							<div className="flex flex-row items-center">
								<Globe className="h-4 w-4 mr-2" />
								Public
							</div>
							<span className="text-gray-500 text-xs">
								Anyone can see this board
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer flex-col items-start">
							<div className="flex flex-row items-center">
								<Lock className="h-4 w-4 text-gray-500 mr-2" />
								Private
							</div>
							<span className="text-gray-500 text-xs">
								Only members can see this board
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="flex -space-x-1 overflow-hidden">
					{avatars.map(({ img, name }, i) => (
						<img
							key={i}
							src={img}
							alt={`${name} avatar`}
							title={name}
							className="w-8 h-8 inline-block rounded-full ring-2 ring-white"
						/>
					))}
				</div>
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
