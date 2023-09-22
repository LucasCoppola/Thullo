import Image from 'next/image'
import { Lock } from 'lucide-react'
import { Globe } from '@/components/ui/icons'
import Link from 'next/link'
import type { Board } from '@prisma/client'
import { getBoardMembers } from '@/app/server/membersOperations'
import { findUserById } from '@/app/server/usersOperations'
import type { CoverImageType } from '@/app/types'

export default async function BoardCard({
	id,
	title,
	coverImage,
	visibility,
	authorId
}: Board) {
	const { author } = await findUserById({ id: authorId })
	const { members } = await getBoardMembers({ boardId: id || '' })
	const remainingAvatars = members?.length! - 2
	const typedCoverImage = coverImage as CoverImageType

	return (
		<Link href={`/boards/${id}`}>
			<div className="bg-white hover:shadow-lg rounded-xl shadow-md w-60 h-60">
				{typedCoverImage.type === 'color' ? (
					<div
						className="w-full h-[138px] rounded-t-xl mb-3"
						style={{
							backgroundColor: typedCoverImage.bg
						}}
					></div>
				) : (
					<Image
						className="w-full h-[138px] rounded-t-xl object-cover mb-3"
						src={typedCoverImage.bg}
						alt="Board cover image"
						width={200}
						height={50}
					/>
				)}
				<div className="px-3">
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
						<Image
							src={
								author?.image ||
								`https://avatars.dicebear.com/api/micah/${author?.name}.svg`
							}
							alt={`${author?.name} avatar`}
							title={author?.name!}
							className="w-8 h-8 rounded-lg"
							width={400}
							height={400}
						/>
						{members?.slice(0, 2).map(({ image, name, id }) => (
							<Image
								key={id}
								src={image || ''}
								alt={`${name} avatar`}
								title={name!}
								className="w-8 h-8 rounded-lg"
								width={400}
								height={400}
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
