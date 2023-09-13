import Image from 'next/image'
import { Download, Paperclip, Trash } from 'lucide-react'

import type { Attachment } from '@prisma/client'
import Link from 'next/link'

export default function AttachmentComponent({
	cardId,
	attachment
}: {
	cardId: string
	attachment: Attachment
}) {
	const isPDF = attachment.filename.toLowerCase().endsWith('.pdf')

	return (
		<>
			{isPDF ? (
				<PdfAttachment attachment={attachment} />
			) : (
				<ImageAttachment attachment={attachment} />
			)}
		</>
	)
}

function ImageAttachment({ attachment }: { attachment: Attachment }) {
	return (
		<div className="flex flex-row w-full mb-3">
			<Link href={attachment.url} target="_blank">
				<Image
					src={attachment.url}
					alt="unsplash random image"
					width={400}
					height={400}
					className="w-20 h-14 object-cover rounded-lg mr-3"
				/>
			</Link>
			<div className="flex flex-col w-4/6">
				<div className="flex flex-row mb-1.5">
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
						/>
						<Trash
							className="h-3.5 w-3.5 text-red-600 ml-2"
							role="button"
						/>
					</div>
				</div>
				<h3 className="text-xs text-gray-900 font-medium">
					{attachment.filename}
				</h3>
			</div>
		</div>
	)
}

function PdfAttachment({ attachment }: { attachment: Attachment }) {
	return (
		<div className="flex flex-row w-full">
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

			<div className="flex flex-col w-4/6">
				<div className="flex flex-row mb-1.5 justify-between">
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
					<div className="flex flex-row items-center">
						<Download
							className="h-3.5 w-3.5 text-blue-600"
							role="button"
						/>
						<Trash
							className="h-3.5 w-3.5 text-red-600 ml-2"
							role="button"
						/>
					</div>
				</div>
				<h3 className="text-xs text-gray-900 font-medium">
					{attachment.filename}
				</h3>
			</div>
		</div>
	)
}
