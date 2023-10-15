import { useRef, useState, useEffect, type MouseEvent } from 'react'

export default function DraggableContainer({ children }: { children: React.ReactNode }) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [isDragging, setDragging] = useState(false)
	const [initialX, setInitialX] = useState(0)
	const [initialScrollLeft, setInitialScrollLeft] = useState(0)

	const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragging(true)
		setInitialX(e.clientX)
		setInitialScrollLeft(containerRef.current?.scrollLeft || 0)
	}

	const handleMouseMove = (e: any) => {
		if (!isDragging) return
		const deltaX = e.clientX - initialX
		if (containerRef.current) {
			containerRef.current.scrollLeft = initialScrollLeft - deltaX
		}
	}

	const handleMouseUp = () => {
		setDragging(false)
	}

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		} else {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [handleMouseMove])

	return (
		<div ref={containerRef} className="flex flex-row gap-8 w-full" onMouseDown={handleMouseDown}>
			{children}
		</div>
	)
}
