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
import { updateBoard } from '@/app/server/boardsOperations'
import { removeMemberAction } from '@/app/actions'

import MemberList from './sheet-components/member-list'
import Description from './sheet-components/description'
import EditableTitle from './shared/editable-title'

export default function BoardSheet({
	id,
	author,
	createdAt,
	members,
	title: boardTitle,
	description: boardDescription,
	currUserId
}: { author: AuthorProps; members: User[]; currUserId: string } & BoardProps) {
	const [description, setDescription] = useState(boardDescription)
	const [title, setTitle] = useState(boardTitle)

	async function updateBoardClient() {
		if (title === boardTitle && description === boardDescription) {
			return
		} else if (title === boardTitle && description !== boardDescription) {
			await updateBoard({
				boardId: id!,
				description: description || '',
				authorId: author?.id || '',
				currUserId
			})
			return
		} else if (title !== boardTitle && description === boardDescription) {
			await updateBoard({
				boardId: id!,
				title: title || '',
				authorId: author?.id || '',
				currUserId
			})
			return
		}
	}

	const updateBoardMutation = useMutation(updateBoardClient, {
		onSuccess: () => console.log('success, boardUpdated'),
		onError: () => console.error('error, boardUpdated(?)')
	})

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
						<EditableTitle
							initialValue={title}
							onSave={(editedTitle) => {
								setTitle(editedTitle)
								updateBoardMutation.mutate()
							}}
							titleClassName="text-xl font-semibold px-2.5 py-1 hover:bg-gray-200 mb-1 rounded-sm"
							inputClassName="px-2 py-0.5 text-xl font-semibold mb-1"
						/>
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
								updateBoardMutation={updateBoardMutation}
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
