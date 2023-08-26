import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { addMember } from '@/app/server'
import { BoardProps } from '@/app/types'
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
import { Info } from 'lucide-react'

export default function AddMemberModal({ authorId, id }: BoardProps) {
	const { data: session } = useSession()
	const [email, setEmail] = useState('')

	async function handleOnSubmit(e: any) {
		e.preventDefault()
		if (authorId !== session?.userId) {
			throw new Error('You are not the author of this board')
		}
		const { user } = await addMember({
			boardId: id || '',
			currUserId: session?.userId || '',
			email,
			authorId
		})
	}
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
						<div className="h-40 relative">
							<form
								onSubmit={handleOnSubmit}
								className="flex flex-row gap-2"
							>
								<input
									type="email"
									placeholder="Email address"
									className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Button type="submit" variant="blue">
									Invite
								</Button>
							</form>
							<p className="text-gray-500 text-xs absolute -bottom-3 flex flex-row items-center">
								<Info strokeWidth={1.25} className="mr-2" />
								Make sure the member is signed up. If not, they
								should sign up using this email.
							</p>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
