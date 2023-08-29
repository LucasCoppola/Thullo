'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { addMember, findUsers } from '@/app/server'
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
import { Info, X } from 'lucide-react'
/*
	- User enters email or name of the desired member of the board
		- Loading users
		- Users with name and image
		- Not found
	- Selected ui with an x if you don't want to unselect that member

	Idk yet:
	- Once selected, click invite and the send the invitation
	- This should appear in a box with notifications where you can accept or decline
*/
export default function AddMemberModal({ authorId, id }: BoardProps) {
	const { data: session } = useSession()
	const currUserId = session?.userId || ''
	const [keyword, setKeyword] = useState('')
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)

	const { data: users, isLoading: isLoadingUsers } = useQuery(
		['searchUsers', keyword],
		async () => {
			const { users } = await findUsers({ keyword, currUserId })
			return users
		}
	)

	async function addMemberClient(selectedUser: User | null) {
		const boardId = id!
		const userId = selectedUser?.id || '' // desired member id

		if (authorId !== currUserId) {
			throw new Error('Unauthorized')
		}
		if (selectedUser?.id === currUserId) {
			throw new Error('You cannot add yourself')
		}

		try {
			const { addMemberToBoard, e } = await addMember({
				authorId,
				boardId,
				currUserId,
				userId
			})

			if (
				(e && (e as Error).message === 'User already added') ||
				!addMemberToBoard
			) {
				throw new Error('User already added to the board')
			}
			return { addMemberToBoard }
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
	const { isLoading, mutate } = useMutation(addMemberClient, {
		onSuccess: () => {
			setOpen(false)
			// add a toast
			console.log('Success!')
		},
		onError: (error) => {
			// add a toast
			console.log('onError by react-query', error)
		},
		onSettled: () => {
			setSelectedUser(null)
			setKeyword('')
		}
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		mutate(selectedUser)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="gray"
					className="h-8 w-8"
					title="Add a member"
					onClick={() => setOpen(true)}
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
							<form
								onSubmit={handleSubmit}
								className="flex flex-row"
							>
								<input
									placeholder="Search by name or email"
									className="bg-gray-50 border mr-3 border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-1 hover:ring-1 hover:ring-gray-200 focus:ring-gray-200"
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
								/>
								<Button
									variant="blue"
									type="submit"
									disabled={isLoading}
								>
									{isLoading ? (
										<LoadingCircle className="fill-white mx-3 text-blue-200" />
									) : (
										'Invite'
									)}
								</Button>
							</form>

							{isLoadingUsers ? (
								<p className="flex justify-center mt-8">
									<LoadingCircle className="fill-gray-500 text-gray-300" />
								</p>
							) : users && users.length > 0 ? (
								<ul>
									{users.map((user) => (
										<div key={user.id} className="relative">
											<div
												className={`flex flex-row mt-3 py-1 px-2 rounded-md items-center cursor-pointer ${
													selectedUser?.id === user.id
														? 'bg-blue-100'
														: 'hover:bg-gray-200'
												}`}
												onClick={() =>
													setSelectedUser(user)
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
												<li
													className={`${
														selectedUser?.id ===
														user.id
															? 'text-blue-500'
															: 'text-gray-800'
													}`}
												>
													{user.name}
												</li>
											</div>
											{selectedUser?.id === user.id && (
												<X
													className="h-4 w-4 absolute right-1 top-[6px] text-blue-500 rounded-full hover:bg-blue-200"
													onClick={() =>
														setSelectedUser(null)
													}
												/>
											)}
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
