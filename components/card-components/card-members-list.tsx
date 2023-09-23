import Image from 'next/image'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '../ui/alert-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { findUserById } from '@/app/server/usersOperations'
import { removeCardMember } from '@/app/server/membersOperations'
import type { Card, User } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function CardMembersList({
	cardMembers,
	refetchCardMembers,
	card
}: {
	cardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	refetchCardMembers: () => void

	card: Card
}) {
	const { data: session } = useSession()
	const [hoverUserId, setHoverUserId] = useState<string | null>(null)

	const { data: author, isLoading: loadingAuthor } = useQuery(
		['author', card.authorId],
		async () => {
			if (!card.authorId) return
			const { author } = await findUserById({ id: card.authorId })
			return author
		}
	)

	const removeMember = useMutation(
		async (id: string) => {
			if (!card.authorId) return
			if (!hoverUserId) return
			if (!session) return
			await removeCardMember({
				authorId: card.authorId,
				cardId: card.id,
				currUserId: session.userId,
				userId: id
			})
		},
		{
			onSuccess: () => console.log('member removed!'),
			onSettled: () => refetchCardMembers()
		}
	)

	return (
		<ul className="mt-2 w-4/5">
			<li className="flex items-center gap-3 mb-2 hover:bg-gray-100 rounded-sm px-1 py-0.5">
				{loadingAuthor ? (
					<div className="animate-pulse h-7 w-full bg-gray-200 rounded-sm"></div>
				) : (
					<>
						<Image
							src={author?.image || ''}
							alt={`${author?.name} avatar`}
							className="rounded-lg"
							width={28}
							height={28}
						/>
						<span className="font-medium text-xs text-gray-700">
							{author?.name}
						</span>
					</>
				)}
			</li>
			{cardMembers?.map(({ name, id, image }) => (
				<li
					key={id}
					className="flex items-center gap-3 mb-2 hover:bg-gray-100 rounded-sm px-1 py-0.5"
					onMouseEnter={() => setHoverUserId(id)}
					onMouseLeave={() => setHoverUserId(null)}
				>
					<div>
						<Image
							src={image || ''}
							alt={`${name} avatar`}
							className="rounded-lg"
							width={28}
							height={28}
						/>
					</div>
					<span className="font-medium text-xs text-gray-700">
						{name}
					</span>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							{hoverUserId === id && (
								<X
									role="button"
									className="h-3 w-3 text-gray-500 rounded-sm ml-auto mr-1"
									strokeWidth={2.5}
								/>
							)}
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									remove <strong>{name}</strong> from the
									card.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-red-500 hover:bg-red-600"
									onClick={() => removeMember.mutate(id)}
								>
									Remove
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</li>
			))}
		</ul>
	)
}
