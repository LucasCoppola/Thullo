import Image from 'next/image'
import { MessageSquare, Paperclip } from 'lucide-react'
import type { Card } from '@prisma/client'

export default function CardView({
	setOpen,
	card,
	attachmentsLength,
	commentsLength
}: {
	setOpen: (val: boolean) => void
	card: Card
	attachmentsLength: number
	commentsLength: number
}) {
	const fakeLabelJson = [
		{
			id: 'bveureobveybo8',
			name: 'Technical',
			color: { text: '#16a34a', bg: '#dcfce7' }
		},
		{
			id: 'brwuvbrwu9br',
			name: 'Fast',
			color: { text: '#dc2626', bg: '#fee2e2' }
		},
		{
			id: 'verget',
			name: 'Do it now',
			color: { text: '#2563eb', bg: '#dbeafe' }
		},
		{
			id: 'obveybo8',
			name: 'Critical',
			color: { text: '#ea580c', bg: '#ffedd5' }
		},

		{
			id: 'viwrno',
			name: 'Technical',
			color: { text: '#16a34a', bg: '#dcfce7' }
		}
	]
	return (
		<div
			className="bg-white rounded-xl shadow-md hover:shadow-lg p-3 space-y-2"
			style={{ width: '243px' }}
			onClick={() => setOpen(true)}
		>
			{/*
				 Json object {type: color | image, bg: string} 
				 I have to update the prisma schema
				*/}
			{card.coverImage && (
				<Image
					className="w-full h-[138px] rounded-xl object-cover"
					src={card.coverImage}
					alt="card cover image"
					width={200}
					height={50}
				/>
			)}

			<h3 className="font-medium">{card.title}</h3>
			<div className="flex flex-row gap-2 flex-wrap">
				{fakeLabelJson.map(({ color, id, name }) => (
					<span
						key={id}
						className="text-[10px] rounded-sm px-2 py-[1px]"
						style={{
							backgroundColor: color.bg,
							color: color.text
						}}
					>
						{name}
					</span>
				))}
			</div>
			<div className="flex flex-row justify-between items-center pt-2">
				<div className="flex -space-x-1 overflow-hidden items-center">
					{/* {members.map(({ image, name, id }) => (
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
					))} */}
					{/* {remainingAvatars > 0 && (
						<span className="text-gray-500 text-xs tracking-tight pl-2">
							+{remainingAvatars}{' '}
							{remainingAvatars === 1 ? 'other' : 'others'}
						</span>
					)} */}
				</div>
				<div className="flex flex-row text-gray-500 items-center">
					{commentsLength > 0 && (
						<span
							className="flex flex-row text-xs mr-2 items-center"
							title="Comments"
						>
							<MessageSquare className="h-3.5 w-3.5 mr-0.5" />
							{commentsLength}
						</span>
					)}
					{attachmentsLength > 0 && (
						<span
							className="flex flex-row text-xs items-center"
							title="Attachments"
						>
							<Paperclip className="h-3.5 w-3.5 mr-0.5" />
							{attachmentsLength}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
