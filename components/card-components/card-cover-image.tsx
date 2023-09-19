import { ImageIcon } from 'lucide-react'
import { useState } from 'react'

import CoverImageModal from '../cover-image-modal'

export default function CoverImage() {
	const [coverImage, setCoverImage] = useState<{
		type: 'color' | 'image'
		bg: string
	}>({
		type: 'color',
		bg: '#adb5bd'
	})

	return (
		<CoverImageModal
			coverImage={coverImage}
			setCoverImage={setCoverImage}
			triggerButton={
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 px-4 py-1.5 rounded-md w-4/5">
					<ImageIcon className="h-4 w-4 mr-2" />
					Cover
				</button>
			}
		/>
	)
}
