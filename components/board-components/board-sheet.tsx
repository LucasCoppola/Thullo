import Image from 'next/image'
import type { User, Board } from '@prisma/client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MoreHorizontal, User2, Users2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBoardTitle, updateBoardDescription } from '@/app/server/boardsOperations'

import MemberList from '../sheet-components/member-list'
import Description from '../sheet-components/description'
import EditableTitle from '../shared/editable-title'
import { removeMember } from '@/app/server/membersOperations'
import { toast } from 'sonner'

export default function BoardSheet({
	id,
	author,
	createdAt,
	members,
	title: boardTitle,
	description: boardDescription,
	currUserId
}: { author: User; members: Omit<User, 'email' | 'emailVerified'>[] | undefined; currUserId: string } & Board) {
	const [description, setDescription] = useState(boardDescription)
	const [title, setTitle] = useState(boardTitle)
	const queryClient = useQueryClient()

	const updateBoardTitleMutation = useMutation(
		async () => {
			if (title === boardTitle) return

			await updateBoardTitle({
				boardId: id,
				title,
				authorId: author?.id,
				currUserId
			})
		},
		{
			onSuccess: () => toast.success('Board title updated'),
			onError: (e: Error) => toast.error(e.message)
		}
	)

	const updateBoardDescriptionMutation = useMutation(
		async () => {
			if (description === boardDescription) return

			await updateBoardDescription({
				boardId: id!,
				description: description || '',
				authorId: author.id,
				currUserId
			})
		},
		{
			onSuccess: () => toast.success('Board description updated'),
			onError: (e: Error) => toast.error(e.message)
		}
	)

	const removeMemberMutation = useMutation(
		async (userId: string) =>
			await removeMember({
				authorId: author.id,
				boardId: id,
				currUserId,
				userId
			}),
		{
			onSuccess: () => {
				toast.success('Member removed')
				queryClient.invalidateQueries(['board-members', id])
			},
			onError: (e: Error) => toast.error(e.message)
		}
	)

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
								updateBoardTitleMutation.mutate()
							}}
							titleClassName="text-xl font-semibold p-1 hover:bg-gray-200 mb-1 rounded-sm"
							inputClassName="px-2 py-0.5 text-xl font-semibold mb-1"
						/>
					</SheetTitle>
					<SheetDescription asChild>
						<div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
							<hr className="mb-2" />
							<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
								<User2 className="h-3 w-3 mr-1" strokeWidth={2.5} />
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
									<h1 className="font-semibold text-sm text-gray-900">{author?.name}</h1>
									<span className="text-xs font-medium text-gray-500">
										on {createdAt?.toDateString().slice(4)}
									</span>
								</div>
							</div>

							<Description
								description={description || ''}
								setDescription={setDescription}
								updateBoardDescriptionMutation={updateBoardDescriptionMutation}
							/>

							<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
								<Users2 className="h-3.5 w-3.5 mr-1" /> Team
							</span>
							<MemberList author={author} members={members} removeMember={removeMemberMutation} />
						</div>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
