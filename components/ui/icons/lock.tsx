export default function Globe({ className }: { className?: string }) {
	const gray = '#374151'
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#3f3f46"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			className={className}
		>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</svg>
	)
}
