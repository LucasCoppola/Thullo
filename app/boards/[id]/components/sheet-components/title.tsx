import { useEffect, useRef, useState } from 'react'

export default function Title({ title }: { title: string }) {
	const [isEditingTitle, setIsEditingTitle] = useState(false)
	const [editedTitle, setEditedTitle] = useState(title)
	const titleRef = useRef<HTMLDivElement>(null)
	const [titleWidth, setTitleWidth] = useState<number>(0)
	console.log(titleWidth)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				titleRef.current &&
				!titleRef.current.contains(event.target as Node)
			) {
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
	}, [editedTitle])

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
						onBlur={() => setIsEditingTitle(false)}
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
