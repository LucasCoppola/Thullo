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
import { useMutation } from '@tanstack/react-query'
import { removeCardMember } from '@/app/server/membersOperations'
import type { Card, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import SkeletonMember from '../loading/skeleton-member'

export default function CardMembersList({
	cardMembers,
	refetchCardMembers,
	isCardMembersLoading,
	card,
	cardAuthor
}: {
	cardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	refetchCardMembers: () => void
	isCardMembersLoading: boolean
	card: Card
	cardAuthor: Omit<User, 'email' | 'emailVerified'> | undefined
}) {
	const { data: session } = useSession()
	const [hoverUserId, setHoverUserId] = useState<string | null>(null)

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
		<>
			{isCardMembersLoading ? (
				Array.from({ length: 3 }).map((_, i) => <SkeletonMember key={i} />)
			) : (
				<ul className="mt-2 w-4/5">
					<li className="flex items-center gap-3 mb-2 hover:bg-gray-100 rounded-sm px-1 py-0.5">
						<Image
							src={cardAuthor?.image || ''}
							alt={`${cardAuthor?.name} avatar`}
							className="rounded-lg"
							width={28}
							height={28}
						/>
						<span className="font-medium text-xs text-gray-700">{cardAuthor?.name}</span>
					</li>
					{cardMembers?.map(({ name, id, image }) => (
						<li
							key={id}
							className="flex items-center gap-3 mb-2 hover:bg-gray-100 rounded-sm px-1 py-0.5"
							onMouseEnter={() => setHoverUserId(id)}
							onMouseLeave={() => setHoverUserId(null)}
						>
							<Image
								src={image || ''}
								alt={`${name} avatar`}
								className="rounded-lg"
								width={28}
								height={28}
							/>

							<span className="font-medium text-xs text-gray-700">{name}</span>

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
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will remove <strong>{name}</strong> from
											the card.
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
			)}
		</>
	)
}
