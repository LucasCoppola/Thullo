import Image from 'next/image'
import { useState } from 'react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Info, Users2, X } from 'lucide-react'
import type { User } from '@prisma/client'

export default function CardMembers({
	boardMembers
}: {
	boardMembers: User[]
}) {
	const [selectedUser, setSelectedUser] = useState<Omit<
		User,
		'email' | 'emailVerified'
	> | null>(null)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex flex-row items-center justify-start text-gray-700 text-sm ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md w-4/5">
					<Users2 className="h-4 w-4 mr-2" /> Members
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<h1 className="text-sm font-medium text-gray-800 mb-3">
					Assign a member to this card
				</h1>
				<div className="flex flex-row text-xs mb-2">
					<input
						type="text"
						placeholder="Search by name or email"
						className="bg-gray-50 border mr-2 border-gray-300 text-gray-800 rounded-md w-full p-2 focus:outline-none focus:ring-1 hover:ring-1 hover:ring-gray-200 focus:ring-gray-200"
					/>
					<button className="bg-blue-500 hover:bg-blue-600 px-3 py-0.5 text-white rounded-md focus:ring-2">
						Invite
					</button>
				</div>

				<ul>
					{boardMembers.map(({ id, name, image }) => (
						<div
							key={id}
							className="relative first:mt-2 last:pb-2 mb-1"
						>
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
									src={
										image ||
										`https://avatars.dicebear.com/api/micah/${name}.svg`
									}
									width={20}
									height={20}
									className="rounded-full mr-2"
									alt="avatar"
								/>
								<li
									className={`text-xs ${
										selectedUser?.id === id
											? 'text-blue-500'
											: 'text-gray-800'
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

				<p className="text-gray-600 bg-white justify-center text-[10px] border-t w-full pt-2 border-gray-300 flex flex-row items-center">
					<Info
						strokeWidth={1.25}
						className="h-4 w-4 mr-2 text-gray-600"
					/>
					Make sure the member is on the board.
				</p>
			</PopoverContent>
		</Popover>
	)
}
