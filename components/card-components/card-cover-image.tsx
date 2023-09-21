import { ImageIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { updateCoverImage } from '@/app/server/card-operations/coverImage'
import { useSession } from 'next-auth/react'

import CoverImageModal from '../cover-image-modal'
import type { Card } from '@prisma/client'
import type { CoverImageType } from '@/app/types'

export default function CoverImage({
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
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 px-4 py-1.5 rounded-md w-4/5">
					<ImageIcon className="h-4 w-4 mr-2" />
					Cover
				</button>
			}
		/>
	)
}
