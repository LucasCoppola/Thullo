import { User } from '@/app/types'
import { MessageSquare, Paperclip } from 'lucide-react'
import Image from 'next/image'

export default function Card({ members }: { members: User[] }) {
	const remainingAvatars = members?.length! - 2

	return (
		<div className="bg-white rounded-xl shadow-md hover:shadow-lg p-3 space-y-2">
			<Image
				className="w-full h-[138px] rounded-xl object-cover"
				src="https://res.cloudinary.com/dotpfjpno/image/upload/v1691450117/my-unsplash/to7rjwfvcadhdozsrcjs.jpg"
				alt="card cover image"
				width={200}
				height={50}
			/>
			<h3 className="font-medium">Card Title</h3>
			<div className="flex flex-row space-x-2">
				<span className="text-[10px] font-medium text-green-600 bg-green-200 rounded-full px-2 py-[1px]">
					Design
				</span>
				<span className="text-[10px] font-medium text-blue-600 bg-blue-200 rounded-full px-2 py-[1px]">
					Technical
				</span>
			</div>
			<div className="flex flex-row justify-between items-center pt-2">
				<div className="flex -space-x-1 overflow-hidden items-center">
					{members.map(({ image, name, id }) => (
						<Image
							key={id}
							src={
								image ||
								`https://avatars.dicebear.com/api/micah/${name}.svg`
							}
							alt={`${name} avatar`}
							title={name!}
							className="w-6 h-6 inline-block rounded-full ring-2 ring-white"
							width={400}
							height={400}
						/>
					))}
					{remainingAvatars > 0 && (
						<span className="text-gray-500 text-xs tracking-tight pl-2">
							+{remainingAvatars}{' '}
							{remainingAvatars === 1 ? 'other' : 'others'}
						</span>
					)}
				</div>
				<div className="flex flex-row text-gray-500">
					<span className="flex flex-row text-xs mr-2">
						<MessageSquare className="h-4 w-4 mr-0.5" />2
					</span>
					<span className="flex flex-row text-xs">
						<Paperclip className="h-4 w-4 mr-0.5" />2
					</span>
				</div>
			</div>
		</div>
	)
}
