import { MoreHorizontal } from 'lucide-react'
import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger
} from '../ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export default function DeleteItem({
	name,
	dialogDescription,
	deleteFn,
	className,
	align = 'end'
}: {
	name: string
	dialogDescription: string
	deleteFn: () => void
	className?: string
	align?: 'start' | 'end' | 'center'
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<MoreHorizontal role="button" className={className} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align={align}>
				<AlertDialog>
					<AlertDialogTrigger className="w-full">
						<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs">
							Remove {name}
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteFn()}>
								Remove
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
