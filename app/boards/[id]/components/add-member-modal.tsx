import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Add } from '@/components/ui/icons'

export default function AddMemberModal() {
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
					<DialogTitle>Are you sure absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
