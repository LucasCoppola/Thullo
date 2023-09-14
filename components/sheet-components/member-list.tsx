import Image from 'next/image'
import { UserX2 } from 'lucide-react'
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
} from '@/components/ui/alert-dialog'
import type { User } from '@prisma/client'
import type { UseMutationResult } from '@tanstack/react-query'

export default function MemberList({
	author,
	members,
	removeMember
}: {
	author: User
	members: User[]
	removeMember: UseMutationResult<void, unknown, string, unknown>
}) {
	return (
		<ul className="mt-4">
			<li className="flex items-center gap-3 mb-3">
				<Image
					src={
						author?.image ||
						`https://avatars.dicebear.com/api/micah/${author?.name}.svg`
					}
					alt={`${author?.name} avatar`}
					className="rounded-lg"
					width={32}
					height={32}
				/>
				<span className="font-semibold text-sm text-gray-900">
					{author?.name}
				</span>
				<span className="ml-auto text-xs font-medium text-gray-400 flex flex-row items-center">
					Author
				</span>
			</li>
			{members.map(({ name, id, image }) => (
				<li key={id} className="flex items-center gap-3 mb-3">
					<div>
						<Image
							src={
								image ||
								`https://avatars.dicebear.com/api/micah/${name}.svg`
							}
							alt={`${name} avatar`}
							className="rounded-lg"
							width={32}
							height={32}
						/>
					</div>
					<span className="font-semibold text-sm text-gray-900">
						{name}
					</span>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button
								className="border border-[#EB5757] text-[#EB5757] rounded-lg text-xs px-2 py-1 ml-auto hover:bg-[#EB5757] hover:text-white transition duration-200"
								title="Remove member"
							>
								<UserX2 className="h-4 w-4" />
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									delete <strong>{name}</strong> from the
									board.
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
