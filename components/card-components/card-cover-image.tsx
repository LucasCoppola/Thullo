'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { removeCoverImage, updateCoverImage } from '@/app/server/card-operations/coverImage'
import { useSession } from 'next-auth/react'

import CoverImageModal from '../cover-image-modal'
import type { Card } from '@prisma/client'
import type { CoverImageType } from '@/app/types'

export function CoverImageSelector({
	coverImage,
	setCoverImage,
	card
}: {
	coverImage: CoverImageType | null
	setCoverImage: (value: CoverImageType) => void
	card: Card
}) {
	const { data: session } = useSession()

	const mutateCoverImage = useMutation(
		async () => {
			if (!coverImage) return

			await updateCoverImage({
				cardId: card.id,
				authorId: card.authorId,
				coverImage,
				userId: session?.userId!
			})
		},
		{
			onSuccess: () => console.log('cover image updated!')
		}
	)

	const handleSelectImage = (selectedImage: CoverImageType) => {
		setCoverImage(selectedImage)
		mutateCoverImage.mutate()
	}

	return (
		<CoverImageModal
			coverImage={coverImage}
			setCoverImage={handleSelectImage}
			triggerButton={
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md w-4/5">
					<ImageIcon className="h-4 w-4 mr-2" />
					Cover
				</button>
			}
		/>
	)
}

export function CardCoverImage({
	coverImage,
	setCoverImage,
	card,
	isCoverImageLoading
}: {
	coverImage: CoverImageType | null
	setCoverImage: (value: CoverImageType | null) => void
	card: Card
	isCoverImageLoading: boolean
}) {
	const { data: session } = useSession()
	const [isCoverImageHovered, setIsCoverImageHovered] = useState(false)

	const { mutate } = useMutation(
		async () =>
			await removeCoverImage({
				authorId: card.authorId,
				cardId: card.id,
				userId: session?.userId!
			}),
		{
			onSuccess: () => {
				setCoverImage(null)
				console.log('cover image removed!')
			}
		}
	)

	return (
		<>
			{isCoverImageLoading ? (
				<div className="animate-pulse w-full h-32 bg-gray-200 rounded-lg"></div>
			) : coverImage ? (
				coverImage.type === 'image' ? (
					<div
						className="relative"
						onMouseEnter={() => setIsCoverImageHovered(true)}
						onMouseLeave={() => setIsCoverImageHovered(false)}
					>
						<Image
							src={coverImage?.bg}
							alt="unsplash random image"
							width={400}
							height={400}
							className="w-full h-32 object-cover rounded-lg"
						/>

						<button
							onClick={() => mutate()}
							className={`absolute top-2 right-2 py-1 px-2 bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 text-xs rounded-sm
										${
											isCoverImageHovered
												? 'opacity-100 visibility-visible transition-opacity duration-200 ease-in-out'
												: 'opacity-0 visibility-hidden transition-opacity duration-200 ease-in-out'
										}
										`}
						>
							Remove
						</button>
					</div>
				) : (
					<div
						className="relative"
						onMouseEnter={() => setIsCoverImageHovered(true)}
						onMouseLeave={() => setIsCoverImageHovered(false)}
					>
						<div
							className="w-full h-32 rounded-lg"
							style={{
								backgroundColor: coverImage?.bg
							}}
						></div>
						<button
							onClick={() => mutate()}
							className={`absolute top-2 right-2 py-1 px-2 bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 text-xs rounded-sm
										${
											isCoverImageHovered
												? 'opacity-100 visibility-visible transition-opacity duration-200 ease-in-out'
												: 'opacity-0 visibility-hidden transition-opacity duration-200 ease-in-out'
										}
										`}
						>
							Remove
						</button>
					</div>
				)
			) : null}
		</>
	)
}
