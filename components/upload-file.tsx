import { createAttachment } from '@/app/server/card-operations/attachments'
import { UploadButton } from '@/lib/uploadthing'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import type { UploadFileResponse } from 'uploadthing/client'

export default function UploadFile({ cardId }: { cardId: string }) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const attachmentMutation = useMutation(
		async (file: UploadFileResponse) => {
			if (!file || !session) return

			await createAttachment({
				id: file.fileKey,
				filename: file.fileName,
				url: file.url,
				size: file.size,
				userId: session.userId,
				cardId
			})
		},
		{
			onSuccess: () => toast.success('Attachment created'),
			onError: (e: Error) => toast.error(e.message),
			onSettled: () => queryClient.invalidateQueries(['attachments', cardId])
		}
	)
	return (
		<UploadButton
			content={{
				button({ isUploading }) {
					if (isUploading) return <div>Loading...</div>
				}
			}}
			appearance={{
				button: 'text-gray-500 ut-uploading:cursor-not-allowed ut-uploading:text-gray-500 h-5 ut-button:bg-gray-100 bg-white text-[10px] ml-3 p-0.5 rounded-sm text-gray-500 cursor-pointer hover:bg-gray-100 flex flex-row items-center px-2',
				allowedContent: 'flex h-8 flex-col items-center justify-center px-2 hidden'
			}}
			endpoint="imageUploader"
			onClientUploadComplete={(res) => {
				if (res) {
					attachmentMutation.mutate(res[0]!)
				}
			}}
			onUploadError={(error: Error) => {
				toast.error(error.message)
			}}
		/>
	)
}
