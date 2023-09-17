'use server'

import prisma from '@/lib/prisma'
import type { Attachment } from '@prisma/client'
import { utapi } from 'uploadthing/server'

export async function createAttachment({
	id,
	filename,
	url,
	size,
	userId,
	cardId
}: Omit<Attachment, 'uploadedAt'>) {
	try {
		const attachment = await prisma.attachment.create({
			data: {
				id,
				filename,
				url,
				size,
				userId,
				cardId
			}
		})

		return { attachment }
	} catch (e) {
		console.error((e as Error).message)
		throw e
	}
}

export async function getAttachments({ cardId }: { cardId: string }) {
	try {
		const attachments = await prisma.attachment.findMany({
			where: {
				cardId
			}
		})

		return { attachments }
	} catch (e) {
		console.error((e as Error).message)
		throw e
	}
}

export async function removeAttachment({
	cardId,
	attachmentId,
	attachmentAuthor,
	cardAuthor,
	userId
}: {
	cardId: string
	attachmentId: string
	attachmentAuthor: string
	cardAuthor: string
	userId: string
}) {
	try {
		if (userId !== attachmentAuthor || userId !== cardAuthor) {
			throw new Error('Unauthorized')
		}

		const removeAttachment = await prisma.attachment.delete({
			where: {
				cardId,
				id: attachmentId
			}
		})
		await utapi.deleteFiles(attachmentId)

		return { removeAttachment }
	} catch (e) {
		console.error((e as Error).message)
		throw e
	}
}
