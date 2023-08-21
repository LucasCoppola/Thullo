import { BoardProps } from '@/app/server'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { Globe } from './icons'
import Link from 'next/link'

const avatars = [
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' }
]

export default function BoardCard({
	id,
	title,
	coverImage,
	visibility
}: BoardProps) {
	const remainingAvatars = avatars.length - 3

	return (
		<Link href={`/boards/${id}`}>
			<div className="bg-white hover:shadow-lg rounded-xl shadow-md w-60 h-60">
				{coverImage.type === 'color' ? (
					<div
						className="w-full h-[138px] rounded-t-xl mb-3"
						style={{
							backgroundColor: coverImage.bg
						}}
					></div>
				) : (
					<Image
						className="w-full h-[138px] rounded-t-xl object-cover mb-3"
						src={coverImage.bg}
						alt="Board cover image"
						width={200}
						height={50}
					/>
				)}
				<div className="px-3 mb-4">
					<div className="flex items-center justify-between mb-4">
						<h5
							className={`${
								title.length > 24 && 'truncate'
							} font-medium tracking-tight text-gray-800`}
						>
							{title}
						</h5>
						{visibility === 'PUBLIC' ? (
							<Globe className="h-4 w-4" />
						) : (
							<Lock
								className="h-4 w-4 text-gray-700"
								strokeWidth={2.25}
							/>
						)}
					</div>
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
		</Link>
	)
}
