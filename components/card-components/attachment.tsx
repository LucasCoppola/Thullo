import Image from 'next/image'
import { Download, Trash } from 'lucide-react'

import type { Attachment } from '@prisma/client'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { removeAttachment } from '@/app/server/card-operations/attachments'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useSession } from 'next-auth/react'
import { fetchUser } from '@/app/fetch'
import SkeletonAttachment from '../loading/skeleton-attachment'
import { toast } from 'sonner'

export default function AttachmentComponent({
	cardId,
	cardAuthorId,
	attachment
}: {
	cardId: string
	cardAuthorId: string
	attachment: Attachment
}) {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const isPDF = attachment.filename.toLowerCase().endsWith('.pdf')

	async function downloadFile() {
		try {
			const outsideRes = await fetch(attachment.url)

			if (!outsideRes.ok) {
				throw new Error('Failed to download the file')
			}

			const blob = await outsideRes.blob()
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = attachment.filename
			link.click()

			toast.success('File downloaded successfully')
		} catch (e) {
			toast.error((e as Error).message)
		}
	}

	const { data: author, isLoading: isLoadingAuthor } = useQuery(['user', attachment.userId], () =>
		fetchUser(attachment.userId)
	)

	const { mutate } = useMutation(
		async () => {
			if (!session) return
			return await removeAttachment({
				cardId,
				attachmentId: attachment.id,
				attachmentAuthor: attachment.userId,
				cardAuthor: cardAuthorId,
				userId: session.userId
			})
		},
		{
			onSuccess: () => toast.success('Attachment deleted'),
			onError: (e) => toast.error((e as Error).message),
			onSettled: () => queryClient.invalidateQueries(['attachments', cardId])
		}
	)

	return (
		<>
			{isLoadingAuthor ? (
				<SkeletonAttachment />
			) : (
				<div className="flex flex-row w-full mb-3">
					{isPDF ? (
						<Link href={attachment.url} target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 80 56"
								className="rounded-lg"
								width="80px"
								height="56px"
							>
								<rect width="100%" height="100%" fill="#e0e0e0" />
								<text x="50%" y="50%" fontSize="20" textAnchor="middle" dy=".3em" fill="#999">
									{attachment.filename.slice(0, 2)}
								</text>
							</svg>
						</Link>
					) : (
						<Link href={attachment.url} target="_blank">
							<div style={{ width: '80px', height: '56px' }}>
								<Image
									src={attachment.url}
									alt="attachment preview"
									className="h-14 object-cover rounded-lg"
									width={500}
									height={500}
								/>
							</div>
						</Link>
					)}
					<div className="flex flex-col w-full ml-3">
						<div className="flex flex-row">
							<span className="text-[10px] text-gray-500">
								Added{' '}
								{new Date(attachment.uploadedAt).toLocaleDateString('en-us', {
									month: 'short',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
									hour12: true
								})}
							</span>
							<div className="ml-auto flex flex-row items-center">
								<Download className="h-3.5 w-3.5 text-blue-600" role="button" onClick={downloadFile} />

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Trash className="h-3.5 w-3.5 text-red-600 ml-2" role="button" />
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this
												attachment from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 hover:bg-red-600"
												onClick={() => mutate()}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
						<h3 className="text-xs text-gray-900 font-medium my-auto">{attachment.filename}</h3>
						<span className="text-[10px] text-gray-500 mt-auto">{`by ${author!.name}`}</span>
					</div>
				</div>
			)}
		</>
	)
}
