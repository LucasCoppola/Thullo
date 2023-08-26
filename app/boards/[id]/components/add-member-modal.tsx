'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { addMembers } from '@/app/server'
import { BoardProps, User } from '@/app/types'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Add, LoadingCircle } from '@/components/ui/icons'
import { Info } from 'lucide-react'
/*
	- User enters email or name of the desired member of the board
		- Loading users
		- Users with name and image
		- Not found
	- Selected ui like trello where you can remove them if you want

	Idk yet:
	- Once selected, click invite and the send the invitation
	- This should appear in a box with notifications where you can accept or decline
*/
export default function AddMemberModal({ authorId, id }: BoardProps) {
	const { data: session } = useSession()
	const [keyword, setKeyword] = useState('')
	const [selectedUsers, setSelectedUsers] = useState<User[]>([])

	const { data, isLoading } = useQuery(
		['searchUsers', id, session?.userId, keyword, authorId],
		async () => {
			const { users } = await addMembers({
				boardId: id || '',
				currUserId: session?.userId || '',
				keyword,
				authorId
			})
			return users || []
		}
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="gray"
					className="h-8 w-8"
					title="Add a member"
				>
					<Add className="h-[19px] w-[19px] text-gray-500" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-gray-800 mb-2">
						Add a Member
					</DialogTitle>
					<DialogDescription asChild>
						<div className="h-40 relative">
							<input
								type="email"
								placeholder="Search by name or email"
								className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-1 hover:ring-1 hover:ring-gray-200 focus:ring-gray-200"
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
							/>

							{isLoading ? (
								<p className="flex justify-center mt-8">
									<LoadingCircle className="fill-gray-500 text-gray-300" />
								</p>
							) : data && data.length > 0 ? (
								<ul>
									{data.map((user) => (
										<div
											key={user.id}
											className="flex flex-row mt-3 hover:bg-gray-200 p-1 rounded-md cursor-pointer"
											onClick={() =>
												setSelectedUsers([
													...selectedUsers,
													user
												])
											}
										>
											<Image
												src={
													user.image ||
													`https://avatars.dicebear.com/api/micah/${user.name}.svg`
												}
												width={20}
												height={20}
												className="rounded-full mr-2"
												alt="avatar"
											/>
											<li>{user.name}</li>
										</div>
									))}
								</ul>
							) : (
								<p className="flex justify-center mt-8">
									No results found.
								</p>
							)}

							<p className="text-gray-500 justify-center text-xs absolute -bottom-3 border-t w-full pt-2 border-gray-300 flex flex-row items-center">
								<Info
									strokeWidth={1.25}
									className="mr-2 text-gray-500"
								/>
								Make sure the member is signed up.
							</p>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
