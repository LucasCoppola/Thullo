import Tooltip from '@/components/ui/tooltip'
import type { UseMutationResult } from '@tanstack/react-query'
import { FileText, Pencil } from 'lucide-react'
import { useState } from 'react'

export default function Description({
	description,
	setDescription,
	updateBoardMutation
}: {
	description: string
	setDescription: (description: string) => void
	updateBoardMutation: UseMutationResult<void, unknown, void, unknown>
}) {
	const [editDescription, setEditDescription] = useState(false)

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
		<>
			<div className="mt-5 flex flex-row items-center">
				<span className="text-xs font-medium text-gray-500 flex flex-row items-center">
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
				className={`relative mt-3 text-sm text-black ${
					!editDescription && 'mb-8'
				}`}
			>
				{editDescription ? (
					<>
						<Tooltip
							iconClassName="absolute top-2 right-2 text-gray-700 bg-white"
							contentClassName="absolute -top-12 right-0 text-xs p-2"
						>
							Make a word <strong>bold</strong> by
							<br />
							enclosing it in <strong>*</strong>
							asterisks
							<strong>*</strong>.
						</Tooltip>

						<textarea
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-gray-300"
							rows={12}
							value={description || ''}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</>
				) : (
					<>
						{description ? (
							<p
								className="break-words"
								dangerouslySetInnerHTML={{
									__html: renderFormattedText(description)
								}}
							/>
						) : (
							<p className="mt-8 font-medium text-gray-600 text-center">
								Add a description to let your teammates know
								what this board is used for.
							</p>
						)}
					</>
				)}
			</div>

			{editDescription && (
				<div className="flex flex-row pt-2 pb-4">
					<button
						className="bg-[#219653] hover:bg-[#1e7b48] text-white text-xs rounded-lg px-3 py-1.5 mr-4 transition duration-200"
						onClick={() => {
							setEditDescription(false)
							updateBoardMutation.mutate()
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
		</>
	)
}
