'use client'

import { useState } from 'react'
import BoardSheet from './board-sheet'
import AddMemberModal from './add-member-modal'
import Image from 'next/image'
import type { User, Board, BoardVisibility } from '@prisma/client'
import { updateVisibilityAction } from '@/app/actions'
import { Lock } from 'lucide-react'
import { Globe, LoadingCircle } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useMutation } from '@tanstack/react-query'

export default function BoardHeader({
	author,
	currUserId,
	members,
	...board
}: {
	author: Omit<User, 'email' | 'emailVerified'> | null
	currUserId: string
	members: User[]
} & Board) {
	const [updateVisibility, setUpdateVisibility] = useState(board.visibility)

	const { mutate, isLoading } = useMutation(
		async (newVisibility: BoardVisibility) => {
			isAuthorized(currUserId, newVisibility)

			if (newVisibility !== board.visibility) {
				return updateVisibilityAction({
					boardId: board.id || '',
					visibility: newVisibility,
					authorId: author!.id,
					currUserId
				})
			}
		}
	)

	function isAuthorized(currUserId: string, visibility?: BoardVisibility) {
		if (author?.id !== currUserId) {
			throw new Error('You are not the author of this board')
		}
		setUpdateVisibility(visibility || board.visibility)
	}

	return (
		<div className="mt-4 flex justify-between items-center">
			<div className="flex space-x-4 flex-row items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-9 mr-2" variant="gray">
							{isLoading ? (
								<LoadingCircle className="fill-white mx-6 text-gray-400" />
							) : (
								<>
									{updateVisibility === 'PUBLIC' ? (
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
									{updateVisibility[0]?.concat(
										updateVisibility.slice(1).toLowerCase()
									)}
								</>
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
						<DropdownMenuItem
							className="cursor-pointer flex-col items-start"
							onClick={() => {
								isAuthorized(currUserId, 'PUBLIC')
								mutate('PUBLIC')
							}}
						>
							<div className="flex flex-row items-center">
								<Globe className="h-4 w-4 mr-2" />
								Public
							</div>
							<span className="text-gray-500 text-xs">
								Anyone can see this board
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer flex-col items-start"
							onClick={() => {
								isAuthorized(currUserId, 'PRIVATE')
								mutate('PRIVATE')
							}}
						>
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
					<Image
						src={author?.image || ''}
						alt={`${author?.name} avatar`}
						title={author?.name!}
						className="w-8 h-8 inline-block rounded-full ring-2 ring-white"
						width={400}
						height={400}
					/>
					{members.map(({ image, name, id }) => (
						<Image
							key={id}
							src={image || ''}
							alt={`${name} avatar`}
							title={name!}
							className="w-8 h-8 inline-block rounded-full ring-2 ring-white"
							width={400}
							height={400}
						/>
					))}
				</div>
				<AddMemberModal {...board} />
			</div>
			<BoardSheet
				{...board}
				author={author as User}
				members={members}
				currUserId={currUserId}
			/>
		</div>
	)
}
