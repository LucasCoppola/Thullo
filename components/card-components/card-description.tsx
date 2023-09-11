import { FileText, Pencil } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Tooltip from '../ui/tooltip'
import { useMutation } from '@tanstack/react-query'
import { updateCardDescription } from '@/app/server/cardOperations'
import { useSession } from 'next-auth/react'

export default function CardDescription({
	cardDescription,
	cardId,
	authorId
}: {
	cardDescription: string
	cardId: string
	authorId: string
}) {
	const [description, setDescription] = useState(cardDescription)
	const [editDescription, setEditDescription] = useState(false)
	const [textareaHeight, setTextareaHeight] = useState(0)
	const paragraphRef = useRef<HTMLParagraphElement>(null)
	const { data: session } = useSession()

	const cardDescriptionMutation = useMutation(
		async () => {
			await updateCardDescription({
				authorId,
				cardId,
				description,
				userId: session?.userId!
			})
		},
		{
			onSuccess: () => console.log('success, card description updated!'),
			onError: () => console.error('error, card updated(?)')
		}
	)

	useEffect(() => {
		if (paragraphRef.current) {
			const paragraphHeight = paragraphRef.current.scrollHeight
			setTextareaHeight(paragraphHeight)
		}
	}, [editDescription])

	const renderFormattedText = (text: string) => {
		const boldRegex = /\*(.*?)\*/g
		const lineBreaksReplaced = text.replace(/\n/g, '<br>')
		const formattedText = lineBreaksReplaced.replace(
			boldRegex,
			'<strong>$1</strong>'
		)
		return formattedText
	}

	return (
		<div className="w-full">
			<div className="flex flex-row items-center">
				<span className="text-xs font-medium text-gray-600 flex flex-row items-center">
					<FileText className="h-3.5 w-3.5 mr-1" />
					Description
				</span>
				{!editDescription && (
					<button
						className="ml-3 border border-gray-300 rounded-full p-1 hover:bg-gray-200 transition duration-200 flex flex-row items-center text-gray-400"
						title="Edit description"
						onClick={() => setEditDescription(true)}
					>
						<Pencil className="h-3.5 w-3.5" />
					</button>
				)}
			</div>

			<div
				className={`relative text-sm text-black ${
					!editDescription && 'mb-4'
				}`}
			>
				{editDescription ? (
					<>
						<Tooltip
							iconClassName="absolute top-4 right-2 text-gray-700 bg-white"
							contentClassName="absolute -top-12 right-0"
						>
							Make a word <strong>bold</strong> by
							<br />
							enclosing it in <strong>*</strong>
							asterisks
							<strong>*</strong>.
						</Tooltip>

						<textarea
							className="w-full p-2 border mt-3 mb-1 border-gray-300 rounded-lg focus:outline-gray-300"
							style={{
								height: textareaHeight,
								minHeight: '100px'
							}}
							value={description || ''}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</>
				) : (
					<>
						{description ? (
							<p
								className="break-words mt-2 max-w-[350px]"
								dangerouslySetInnerHTML={{
									__html: renderFormattedText(description)
								}}
								ref={paragraphRef}
							/>
						) : (
							<p className="mt-3 text-gray-500 text-center text-xs">
								Add a description to let your teammates know
								what this board is used for.
							</p>
						)}
					</>
				)}
			</div>
			{editDescription && (
				<div className="flex flex-row pb-4">
					<button
						className="bg-[#219653] hover:bg-[#1e7b48] text-white text-xs rounded-lg px-3 py-1.5 mr-4 transition duration-200"
						onClick={() => {
							setEditDescription(false)
							cardDescriptionMutation.mutate()
						}}
					>
						Save
					</button>
					<button
						className="text-xs font-medium"
						onClick={() => setEditDescription(false)}
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	)
}
