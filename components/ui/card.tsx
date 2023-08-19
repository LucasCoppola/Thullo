import Image from 'next/image'

const avatars = [
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' }
]

export default function Card() {
	const remainingAvatars = avatars.length - 3

	return (
		<div className="bg-white border rounded-xl shadow w-64 h-auto">
			<Image
				className="w-full rounded-xl pb-3"
				src="https://res.cloudinary.com/dotpfjpno/image/upload/v1675864626/YelpCamp/yrwrxu55rg5bdfgyrzcc.jpg"
				alt=""
				width={219}
				height={130}
			/>

			<div className="px-3 mb-4">
				<h5 className="text-lg mb-3 font-medium tracking-tight text-gray-900">
					Simple Project Board
				</h5>
				<div className="flex space-x-3 flex-row items-center">
					{avatars.slice(0, 3).map(({ img, name }, i) => (
						<img
							key={i}
							src={img}
							alt={`${name} avatar`}
							title={name}
							className="w-8 h-8 rounded-lg"
						/>
					))}
					{remainingAvatars > 0 && (
						<span className="text-gray-500 text-sm tracking-tight">
							+{remainingAvatars}{' '}
							{remainingAvatars === 1 ? 'other' : 'others'}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
