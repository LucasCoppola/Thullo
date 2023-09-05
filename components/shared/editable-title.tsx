import { useEffect, useRef, useState } from 'react'

export default function EditableTitle({
	initialValue,
	onSave,
	titleClassName,
	inputClassName
}: {
	initialValue: string
	onSave: (value: string) => void
	titleClassName: string
	inputClassName: string
}) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [editedTitle, setEditedTitle] = useState(initialValue)
	const [titleWidth, setTitleWidth] = useState<number>(0)
	const titleRef = useRef<HTMLHeadingElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				titleRef.current &&
				!titleRef.current.contains(event.target as Node)
			) {
				if (editedTitle !== initialValue) {
					onSave(editedTitle)
				}
				setIsEditingTitle(false)
			}
		}

		const updateTitleWidth = () => {
			if (titleRef.current) {
				const width = titleRef.current.scrollWidth
				setTitleWidth(width)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('resize', updateTitleWidth)
		updateTitleWidth()
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', updateTitleWidth)
		}
	}, [editedTitle, initialValue, onSave])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (editedTitle !== initialValue) {
				onSave(editedTitle)
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
							if (editedTitle !== initialValue) {
								onSave(editedTitle)
							}
							setIsEditingTitle(false)
						}}
						onKeyDown={handleKeyDown}
						autoFocus
						className={`border-2 border-blue-200 focus:outline-none rounded-sm ${inputClassName}`}
						style={{ width: titleWidth + 'px' }}
					/>
				</div>
			) : (
				<div
					role="button"
					className="flex items-center"
					onClick={() => setIsEditingTitle(true)}
				>
					<h2 ref={titleRef} className={titleClassName}>
						{editedTitle}
					</h2>
				</div>
			)}
		</>
	)
}
