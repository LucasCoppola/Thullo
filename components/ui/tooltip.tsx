import { Info } from 'lucide-react'
import { useState } from 'react'

export default function Tooltip({
	iconClassName,
	contentClassName,
	children
}: {
	iconClassName?: string
	contentClassName?: string
	children: React.ReactNode
}) {
	const [tooltipVisible, setTooltipVisible] = useState(false)

	return (
		<>
			<Info
				className={`h-4 w-4 ${iconClassName}`}
				onMouseEnter={() => setTooltipVisible(true)}
				onMouseLeave={() => setTooltipVisible(false)}
			/>

			<div
				className={`${
					tooltipVisible ? 'opacity-100' : 'opacity-0'
				} transition-opacity duration-300 border bg-white rounded-lg p-2 text-xs text-gray-700 shadow-lg ${contentClassName}`}
			>
				<p>{children}</p>
			</div>
		</>
	)
}
