import { useCallback, useEffect, useRef, useState } from 'react'

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
	const [inputWidth, setInputWidth] = useState<number>(0)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleSave = useCallback(() => {
		if (editedTitle.trim() !== '') {
			if (editedTitle !== initialValue) {
				onSave(editedTitle)
			}
		} else {
			setEditedTitle(initialValue)
		}
		setIsEditingTitle(false)
	}, [editedTitle, initialValue, onSave])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				titleRef.current &&
				!titleRef.current.contains(event.target as Node)
			) {
				handleSave()
			}
		}

		const updateTitleWidth = () => {
			if (titleRef.current) {
				const width = titleRef.current.scrollWidth
				setInputWidth(width)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('resize', updateTitleWidth)
		updateTitleWidth()

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', updateTitleWidth)
		}
	}, [handleSave])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value)
		const input = inputRef.current

		if (input) {
			setInputWidth(Math.max(input.scrollWidth, input.clientWidth) + 4) // +4 for padding
		}
	}

	return (
		<>
			{isEditingTitle ? (
				<div className="flex items-center">
					<input
						type="text"
						value={editedTitle}
						onChange={handleInputChange}
						onBlur={handleSave}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleSave()
							}
						}}
						autoFocus
						ref={inputRef}
						className={`border-2 border-blue-200 focus:outline-none rounded-sm ${inputClassName}`}
						style={{ width: `${inputWidth}px`, maxWidth: '240px' }}
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
