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
					<DialogTitle className="text-gray-800 mb-2">
						Add a Member
					</DialogTitle>
					<DialogDescription asChild>
						<div className="flex flex-row gap-2">
							<input
								type="email"
								placeholder="Email address"
								className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
							/>
							<Button variant="blue">Invite</Button>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
