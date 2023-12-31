export default function Globe({
	className,
	color
}: {
	className?: string
	color?: string
}) {
	const gray700 = '#374151'
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 64"
			className={className}
		>
			<title>Public</title>
			<circle
				cx="32"
				cy="32"
				r="30"
				fill="none"
				stroke={color || gray700}
				strokeWidth="3"
			/>
			<path
				d="M53.85 47.85A27 27 0 0 1 24 57.8V56l3-3v-4l4-4v-3l4 4h5l2-2h8z"
				fill={color || gray700}
				stroke={color || gray700}
			/>
			<path
				d="M42 20.59v2.56L38.07 27H31l-5.36 5.26L31 37.51v5.06L27.44 39h-4.58L16 32.11V24.2L11.8 20h-4A27 27 0 0 1 32 5a26.55 26.55 0 0 1 7.06.94L36 9h-6v4l4 4h4.33z"
				fill={color || gray700}
				stroke={color || gray700}
			/>
			<path
				d="M32 60a28 28 0 1 1 28-28 28 28 0 0 1-28 28zm0-54a26 26 0 1 0 26 26A26 26 0 0 0 32 6z"
				fill={color || gray700}
				stroke={color || gray700}
			/>
		</svg>
	)
}
