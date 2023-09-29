'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { findUsers } from '@/app/server/usersOperations'
import type { User, Board } from '@prisma/client'
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
import { addMember } from '@/app/server/membersOperations'
import { toast } from 'sonner'

export default function AddMemberModal({ authorId, id }: Board) {
	const { data: session } = useSession()
	const [keyword, setKeyword] = useState('')
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<Omit<User, 'email' | 'emailVerified'> | null>(null)
	const queryClient = useQueryClient()

	const { data: users, isLoading: isLoadingUsers } = useQuery(['searchUsers', keyword], async () => {
		if (!session) return
		return (await findUsers({ keyword, currUserId: session.userId })) as Omit<User, 'email' | 'emailVerified'>[]
	})

	const { isLoading, mutate } = useMutation(
		async () => {
			if (!session || !selectedUser) return

			return await addMember({
				authorId,
				boardId: id,
				currUserId: session.userId,
				userId: selectedUser.id
			})
		},
		{
			onSuccess: () => {
				setOpen(false)
				toast.success('Member added!')
				queryClient.invalidateQueries(['board-members', id])
			},
			onError: (e: Error) => {
				setOpen(false)
				toast.error(e.message)
			},
			onSettled: () => {
				setSelectedUser(null)
				setKeyword('')
			}
		}
	)

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
					<DialogTitle className="text-gray-800 mb-2">Add a Member</DialogTitle>
					<DialogDescription asChild>
						<div className="relative">
							<div className="h-44 overflow-y-auto">
								<form
									onSubmit={(e) => {
										e.preventDefault()
										mutate()
									}}
									className="flex flex-row"
								>
									<input
										placeholder="Search by name or email"
										className="bg-gray-50 border mr-3 border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-1 hover:ring-1 hover:ring-gray-200 focus:ring-gray-200"
										value={keyword}
										onChange={(e) => setKeyword(e.target.value)}
										required
										autoFocus
									/>
									<Button variant="blue" type="submit" disabled={isLoading}>
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
								) : keyword && users && users.length > 0 ? (
									<ul>
										{users.map(({ id, name, image }) => (
											<div key={id} className="relative first:mt-2 last:pb-6 mb-1">
												<div
													className={`flex flex-row py-1 px-2 rounded-md items-center cursor-pointer ${
														selectedUser?.id === id ? 'bg-blue-100' : 'hover:bg-gray-200'
													}`}
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
														className={`${
															selectedUser?.id === id ? 'text-blue-500' : 'text-gray-800'
														}`}
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
								) : (
									<p className="flex justify-center mt-10">No results found.</p>
								)}

								<p className="text-gray-500 bg-white justify-center text-xs absolute -bottom-3 border-t w-full pt-2 border-gray-300 flex flex-row items-center">
									<Info strokeWidth={1.25} className="mr-2 text-gray-500" />
									Make sure the member is signed up.
								</p>
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
