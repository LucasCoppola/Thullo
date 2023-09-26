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
import { useSession } from 'next-auth/react'
import { removeList } from '@/app/server/boardsOperations'

export default function DeleteList({
	listId,
	boardId,
	boardAuthorId,
	listAuthorId
}: {
	listId: string
	boardId: string
	boardAuthorId: string | undefined
	listAuthorId: string | undefined
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { mutate } = useMutation(
		async () => {
			if (!session || !boardAuthorId || !listAuthorId) return
			return await removeList({ boardAuthorId, listAuthorId, listId, userId: session.userId })
		},
		{
			onSuccess: () => {
				console.log('list removed')
				queryClient.invalidateQueries(['lists', boardId])
			}
		}
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<MoreHorizontal role="button" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<AlertDialog>
					<AlertDialogTrigger>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs">
							Remove List
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete this list and all of its
								cards and content.
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
