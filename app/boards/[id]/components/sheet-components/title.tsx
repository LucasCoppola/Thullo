import { useEffect, useRef, useState } from 'react'

export default function Title({ title }: { title: string }) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [editedTitle, setEditedTitle] = useState(title)
	const titleRef = useRef<HTMLDivElement>(null) // Reference to the title element

	useEffect(() => {
		// Add event listener to handle clicks outside of the title
		const handleClickOutside = (event: any) => {
			if (titleRef.current && !titleRef.current.contains(event.target)) {
				// Clicked outside the title, so exit edit mode
				setIsEditingTitle(false)
			}
		}

		// Attach the event listener
		document.addEventListener('mousedown', handleClickOutside)

		// Clean up the event listener on unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<>
			{isEditingTitle ? (
				<div className="flex items-center w-32">
					<input
						type="text"
						value={editedTitle}
						onChange={(e) => setEditedTitle(e.target.value)}
						onBlur={() => setIsEditingTitle(false)}
						autoFocus
						className="border-b border-blue-500 px-2 py-1 w-32"
					/>
				</div>
			) : (
				<div
					className="flex items-center cursor-pointer"
					onClick={() => setIsEditingTitle(true)} // Toggle edit mode when title is clicked
					ref={titleRef} // Attach ref to the title element
				>
					<h1 className="text-xl font-semibold">{editedTitle}</h1>
				</div>
			)}{' '}
		</>
	)
}
