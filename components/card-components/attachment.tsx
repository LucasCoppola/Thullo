import Image from 'next/image'
import { Download, Paperclip, Trash } from 'lucide-react'

import type { Attachment } from '@prisma/client'
import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
import { removeAttachment } from '@/app/server/cardOperations'
import { findUserById } from '@/app/server/usersOperations'
import { Suspense } from 'react'
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

export default function AttachmentComponent({
	cardId,
	attachment,
	refetchAttachments
}: {
	cardId: string
	attachment: Attachment
	refetchAttachments: () => void
}) {
	const isPDF = attachment.filename.toLowerCase().endsWith('.pdf')

	function formatFileSize(bytes: number) {
		if (bytes >= 1024 * 1024) {
			return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
		} else {
			return (bytes / 1024).toFixed(2) + ' KB'
		}
	}

	async function downloadFile() {
		try {
			const outsideRes = await fetch(attachment.url)

			if (!outsideRes.ok) {
				throw new Error('Failed to fetch the file')
			}

			const blob = await outsideRes.blob()
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = attachment.filename
			link.click()
		} catch (error) {
			console.error('Error downloading the file:', error)
		}
	}

	const { data: user } = useQuery(['user', attachment.userId], async () => {
		const { author } = await findUserById({ id: attachment.userId })
		return author
	})

	const { mutate } = useMutation(
		async () =>
			await removeAttachment({
				cardId,
				attachmentId: attachment.id
			}),
		{
			onSettled: () => refetchAttachments()
		}
	)

	return (
		<>
			<div className="flex flex-row w-full mb-3">
				{isPDF ? (
					<Link href={attachment.url} target="_blank">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 80 56"
							className="rounded-lg mr-3"
							width="80px"
							height="56px"
						>
							<rect width="100%" height="100%" fill="#e0e0e0" />
							<text
								x="50%"
								y="50%"
								fontSize="20"
								textAnchor="middle"
								dy=".3em"
								fill="#999"
							>
								{attachment.filename.slice(0, 2)}
							</text>
						</svg>
					</Link>
				) : (
					<Link href={attachment.url} target="_blank">
						<Image
							src={attachment.url}
							alt="unsplash random image"
							width={400}
							height={400}
							className="w-20 h-14 object-cover rounded-lg mr-3"
						/>
					</Link>
				)}
				<div className="flex flex-col w-4/6">
					<div className="flex flex-row">
						<span className="text-[10px] text-gray-500">
							Added{' '}
							{new Date(attachment.uploadedAt).toLocaleDateString(
								'en-us',
								{
									weekday: 'short',
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								}
							)}
						</span>
						<div className="ml-auto flex flex-row items-center">
							<Download
								className="h-3.5 w-3.5 text-blue-600"
								role="button"
								onClick={downloadFile}
							/>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Trash
										className="h-3.5 w-3.5 text-red-600 ml-2"
										role="button"
									/>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will permanently delete this
											attachment from our servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
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
					<h3 className="text-xs text-gray-900 font-medium my-auto">
						{attachment.filename}
						<span className="text-[8px] text-gray-500 ml-2">
							{formatFileSize(attachment.size)}
						</span>
					</h3>
					<span className="text-[10px] text-gray-500 mt-auto">
						{user?.name ? `by ${user.name}` : null}
					</span>
				</div>
			</div>
		</>
	)
}
