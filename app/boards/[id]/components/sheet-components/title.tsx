import { UseMutationResult } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

export default function Title({
	title,
	setTitle,
	updateBoard
}: {
	title: string
	setTitle: (title: string) => void
	updateBoard: UseMutationResult<void, unknown, void, unknown>
}) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [editedTitle, setEditedTitle] = useState(title)
	const [titleWidth, setTitleWidth] = useState<number>(0)
	const titleRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				titleRef.current &&
				!titleRef.current.contains(event.target as Node)
			) {
				if (editedTitle !== title) {
					setTitle(editedTitle)
					updateBoard.mutate()
				}
				setIsEditingTitle(false)
			}
		}

		const updateTitleWidth = () => {
			if (titleRef.current) {
				const width = titleRef.current.offsetWidth
				setTitleWidth(width / 2)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('resize', updateTitleWidth)
		updateTitleWidth()
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', updateTitleWidth)
		}
	}, [editedTitle, title, setTitle, updateBoard])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (editedTitle !== title) {
				setTitle(editedTitle)
				updateBoard.mutate()
			}
			setIsEditingTitle(false)
		}
	}

	return (
		<>
			{isEditingTitle ? (
				<div
					className="flex items-center"
					style={{ width: titleWidth + 'px' }}
				>
					<input
						type="text"
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						onBlur={() => {
							if (editedTitle !== title) {
								setTitle(editedTitle)
								updateBoard.mutate()
							}
							setIsEditingTitle(false)
						}}
						onKeyDown={handleKeyDown}
						autoFocus
						className="border-2 border-blue-200 px-2 py-0.5 text-xl font-semibold mb-1 rounded-sm focus:outline-none"
						style={{ width: titleWidth + 'px' }}
					/>
				</div>
			) : (
				<div
					role="button"
					className="flex items-center"
					onClick={() => setIsEditingTitle(true)}
					ref={titleRef}
				>
					<h1 className="text-xl font-semibold px-2.5 py-1 hover:bg-gray-200 mb-1 rounded-sm">
						{editedTitle}
					</h1>
				</div>
			)}
		</>
	)
}
