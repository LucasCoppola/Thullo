import Image from 'next/image'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Info, Users2, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCardMember } from '@/app/server/membersOperations'
import type { User } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function CardMembers({
	availableMembers,
	cardId,
	cardAuthorId
}: {
	availableMembers: User[]
	cardId: string
	cardAuthorId: string
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const [selectedUser, setSelectedUser] = useState<Omit<User, 'email' | 'emailVerified'> | null>(null)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const { mutate } = useMutation(
		async () => {
			await addCardMember({
				authorId: cardAuthorId,
				cardId,
				currUserId: session?.userId!,
				userId: selectedUser?.id!
			})
		},
		{
			onSuccess: () => {
				console.log('member added to the card!')
				queryClient.invalidateQueries(['card-members', cardId])
			},
			onError: (error) => console.error((error as Error).message),
			onSettled: () => setIsPopoverOpen(false)
		}
	)

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<button className="flex flex-row items-center justify-start text-gray-700 text-sm ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md w-4/5">
					<Users2 className="h-4 w-4 mr-2" /> Members
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<h1 className="text-sm font-medium text-gray-800 mb-3">Assign a member to this card</h1>
				<div className="flex flex-row text-xs mb-2">
					<input
						type="text"
						placeholder="Search by name or email"
						className="bg-gray-50 border mr-2 border-gray-300 text-gray-800 rounded-md w-full p-2 focus:outline-none focus:ring-1 hover:ring-1 hover:ring-gray-200 focus:ring-gray-200"
					/>
					<button
						onClick={() => mutate()}
						className="bg-blue-500 hover:bg-blue-600 px-3 py-0.5 text-white rounded-md focus:ring-2"
					>
						Invite
					</button>
				</div>

				<ul>
					{availableMembers.map(({ id, name, image }) => (
						<div key={id} className="relative first:mt-2 last:pb-2 mb-1">
							<div
								className={`flex flex-row py-1 px-2 rounded-md items-center cursor-pointer 
								${selectedUser?.id === id ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
								onClick={() =>
									setSelectedUser({
										id,
										name,
										image
									})
								}
							>
								<Image
									src={image || ''}
									width={20}
									height={20}
									className="rounded-full mr-2"
									alt="avatar"
								/>
								<li
									className={`text-xs ${selectedUser?.id === id ? 'text-blue-500' : 'text-gray-800'}`}
								>
									{name}
								</li>
							</div>
							{selectedUser?.id === id && (
								<X
									className="h-4 w-4 absolute right-1 top-[6px] text-blue-500 rounded-full hover:bg-blue-200"
									onClick={() => setSelectedUser(null)}
								/>
							)}
						</div>
					))}
				</ul>

				<p className="text-gray-600 bg-white justify-center text-[10px] border-t w-full pt-2 border-gray-300 flex flex-row items-center">
					<Info strokeWidth={1.25} className="h-4 w-4 mr-2 text-gray-600" />
					Make sure the member is on the board.
				</p>
			</PopoverContent>
		</Popover>
	)
}
