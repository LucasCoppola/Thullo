import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '../ui/alert-dialog'
import { MoreHorizontal } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeCard } from '@/app/server/card-operations/card'
import { useSession } from 'next-auth/react'

export default function DeleteCard({
	cardId,
	cardAuthorId,
	listId
}: {
	cardId: string
	cardAuthorId: string
	listId: string
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session) return
			return await removeCard({ authorId: cardAuthorId, cardId, userId: session.userId })
		},
		{
			onSuccess: () => {
				console.log('card removed')
				queryClient.invalidateQueries(['cards'])
			}
		}
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="absolute right-2 text-gray-700 rounded-md">
					<MoreHorizontal />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<AlertDialog>
					<AlertDialogTrigger>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs">
							Remove Card
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete this card and all of its
								content from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => mutate()}>
								Remove
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
