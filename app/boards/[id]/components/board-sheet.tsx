import Image from 'next/image'
import { AuthorProps, BoardProps, User } from '@/app/types'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import {
	FileText,
	Info,
	MoreHorizontal,
	Pencil,
	User2,
	UserX2,
	Users2
} from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateBoardDescriptionAction } from '@/app/actions'

export default function BoardSheet({
	id,
	title,
	author,
	createdAt,
	members,
	description: boardDescription,
	currUserId
}: { author: AuthorProps; members: User[]; currUserId: string } & BoardProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [description, setDescription] = useState(boardDescription)
	const [tooltipVisible, setTooltipVisible] = useState(false)

	async function updateBoardDescriptionClient() {
		await updateBoardDescriptionAction({
			boardId: id!,
			description: description || '',
			authorId: author?.id || '',
			currUserId
		})
	}

	const renderFormattedText = (text: string) => {
		const boldRegex = /\*(.*?)\*/g
		const lineBreaksReplaced = text.replace(/\n/g, '<br>')
		const formattedText = lineBreaksReplaced.replace(
			boldRegex,
			'<strong>$1</strong>'
		)
		return formattedText
	}

	const { mutate, isLoading } = useMutation(updateBoardDescriptionClient, {
		onSuccess: () => console.log('success'),
		onError: () => console.error('error')
	})

	return (
		<Sheet>
			<SheetTrigger
				title="Show Menu"
				className="flex items-center justify-center w-8 h-7 rounded-md hover:bg-gray-200 transition duration-200"
			>
				<MoreHorizontal />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className="mb-1">{title}</SheetTitle>
					<SheetDescription asChild>
						<div className="overflow-y-auto max-h-[calc(100vh-6rem)]">
							<hr className="mb-2" />
							<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
								<User2
									className="h-3 w-3 mr-1"
									strokeWidth={2.5}
								/>
								Made by
							</span>
							<div className="flex flex-row items-center mt-3">
								<Image
									src={author?.image || ''}
									width={32}
									height={32}
									alt={`${author?.name} avatar`}
									className="rounded-lg mr-3"
								/>
								<div className="flex flex-col">
									<h1 className="font-semibold text-sm text-gray-900">
										{author?.name}
									</h1>
									<span className="text-xs font-medium text-gray-500">
										on {createdAt?.toDateString().slice(4)}
									</span>
								</div>
							</div>

							<div className="mt-5 flex flex-row items-center">
								<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
									<FileText className="h-3.5 w-3.5 mr-1" />
									Description
								</span>
								{!isEditing && (
									<button
										className="ml-3 border border-gray-300 rounded-full p-1 hover:bg-gray-200 transition duration-200 flex flex-row items-center text-gray-400"
										title="Edit description"
										onClick={() => setIsEditing(true)}
									>
										<Pencil className="h-3.5 w-3.5" />
									</button>
								)}
							</div>

							<div className="relative mt-3 text-sm text-black">
								{isEditing ? (
									<>
										<Info
											className="h-4 w-4 absolute top-2 right-2 text-gray-700"
											onMouseEnter={() =>
												setTooltipVisible(true)
											}
											onMouseLeave={() =>
												setTooltipVisible(false)
											}
										/>

										<div
											className={`${
												tooltipVisible
													? 'opacity-100'
													: 'opacity-0'
											} transition-opacity duration-300 absolute -top-12 right-0 border bg-white rounded-lg p-2 text-xs text-gray-700 shadow-lg`}
										>
											<p>
												Make a word{' '}
												<strong>bold</strong> by
												<br />
												enclosing it in{' '}
												<strong>*</strong>
												asterisks
												<strong>*</strong>.
											</p>
										</div>

										<textarea
											className="w-full p-2 border border-gray-300 rounded-lg focus:outline-gray-300"
											rows={12}
											value={description || ''}
											onChange={(e) =>
												setDescription(e.target.value)
											}
										/>
									</>
								) : (
									<>
										{description && (
											<p
												className="break-words"
												dangerouslySetInnerHTML={{
													__html: renderFormattedText(
														description
													)
												}}
											/>
										)}
									</>
								)}
							</div>

							{isEditing && (
								<div className="flex flex-row pt-2">
									<button
										className="bg-[#219653] hover:bg-[#1e7b48] text-white text-xs rounded-lg px-3 py-1.5 mr-4 transition duration-200"
										onClick={() => {
											setIsEditing(false)
											mutate()
										}}
									>
										Save
									</button>
									<button
										className="text-xs font-medium"
										onClick={() => setIsEditing(false)}
									>
										Cancel
									</button>
								</div>
							)}

							<span
								className={`${
									isEditing ? 'mt-4' : 'mt-8'
								} text-xs font-medium text-gray-500 flex flex-row items-center`}
							>
								<Users2 className="h-3.5 w-3.5 mr-1" /> Team
							</span>
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
									<li
										key={id}
										className="flex items-center gap-3"
									>
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
										<button
											className="border border-[#EB5757] text-[#EB5757] rounded-lg text-xs px-2 py-1 ml-auto hover:bg-[#EB5757] hover:text-white transition duration-200"
											title="Remove member"
										>
											<UserX2 className="h-4 w-4" />
										</button>
									</li>
								))}
							</ul>
						</div>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
