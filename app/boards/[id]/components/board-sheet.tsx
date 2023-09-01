import Image from 'next/image'
import { AuthorProps, BoardProps, User } from '@/app/types'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { MoreHorizontal, User2, Users2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { removeMemberAction, updateBoardDescriptionAction } from '@/app/actions'

import MemberList from './sheet-components/member-list'
import Description from './sheet-components/description'
import Title from './sheet-components/title'

export default function BoardSheet({
	id,
	title,
	author,
	createdAt,
	members,
	description: boardDescription,
	currUserId
}: { author: AuthorProps; members: User[]; currUserId: string } & BoardProps) {
	const [description, setDescription] = useState(boardDescription)

	async function updateBoardDescriptionClient() {
		await updateBoardDescriptionAction({
			boardId: id!,
			description: description || '',
			authorId: author?.id || '',
			currUserId
		})
	}

	async function removeMemberClient(userId: string) {
		if (author?.id !== currUserId) {
			throw new Error('Unauthorized')
		}
		if (userId === currUserId) {
			throw new Error("You can't delete yourself")
		}
		if (author.id === userId) {
			throw new Error("You can't delete the author")
		}

		await removeMemberAction({
			authorId: author?.id || '',
			boardId: id!,
			currUserId,
			userId
		})
	}

	const updateBoard = useMutation(updateBoardDescriptionClient, {
		onSuccess: () => console.log('success, boardUpdated'),
		onError: () => console.error('error, boardUpdated(?)')
	})

	const removeMember = useMutation(removeMemberClient, {
		onSuccess: () => console.log('success, member removed'),
		onError: () => console.error('error, member removed(?)')
	})

	return (
		<Sheet>
			<SheetTrigger
				title="Show Menu"
				className="flex items-center justify-center w-8 h-7 rounded-md hover:bg-gray-200 transition duration-200"
			>
				<MoreHorizontal />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className="mb-1" asChild>
						<Title title={title} />
					</SheetTitle>
					<SheetDescription asChild>
						<div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
							<hr className="mb-2" />
							<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
								<User2
									className="h-3 w-3 mr-1"
									strokeWidth={2.5}
								/>
								Made by
							</span>
							<div className="flex flex-row items-center mt-3">
								<Image
									src={author?.image || ''}
									width={32}
									height={32}
									alt={`${author?.name} avatar`}
									className="rounded-lg mr-3"
								/>
								<div className="flex flex-col">
									<h1 className="font-semibold text-sm text-gray-900">
										{author?.name}
									</h1>
									<span className="text-xs font-medium text-gray-500">
										on {createdAt?.toDateString().slice(4)}
									</span>
								</div>
							</div>

							<Description
								description={description || ''}
								setDescription={setDescription}
								updateBoard={updateBoard}
							/>

							<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
								<Users2 className="h-3.5 w-3.5 mr-1" /> Team
							</span>
							<MemberList
								author={author}
								members={members}
								removeMember={removeMember}
							/>
						</div>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
