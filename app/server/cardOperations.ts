'use server'

import prisma from '@/lib/prisma'
import type { Attachment } from '@prisma/client'
import { utapi } from 'uploadthing/server'

export async function getCards({ listId }: { listId: string }) {
	try {
		const cards = await prisma.card.findMany({
			where: {
				listId
			}
		})

		return { cards }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function createCard({
	listId,
	title,
	authorId
}: {
	listId: string
	title: string
	authorId: string
}) {
	try {
		const createCard = await prisma.card.create({
			data: {
				authorId,
				listId,
				title
			}
		})

		return { createCard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function updateCardDescription({
	userId,
	authorId,
	cardId,
	description
}: {
	userId: string
	authorId: string
	cardId: string
	description: string
}) {
	try {
		if (authorId !== userId) throw new Error('Unauthorized')

		const updateDescription = await prisma.card.update({
			where: {
				id: cardId
			},
			data: {
				description
			}
		})

		return { updateDescription }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

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
		console.error(e)
		return { e }
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
		console.error(e)
		return { e }
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
		console.error(e)
		return { e }
	}
}

export async function getComments({ cardId }: { cardId: string }) {
	try {
		const comments = await prisma.comment.findMany({
			where: {
				cardId
			}
		})

		return { comments }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function addComment({
	cardId,
	authorId,
	comment
}: {
	cardId: string
	authorId: string
	comment: string
}) {
	try {
		const addComment = await prisma.comment.create({
			data: {
				cardId,
				authorId,
				text: comment
			}
		})

		return { addComment }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function removeComment({
	cardId,
	commentId,
	commentAuthor,
	cardAuthor,
	userId
}: {
	cardId: string
	commentId: string
	commentAuthor: string
	cardAuthor: string
	userId: string
}) {
	try {
		if (userId !== commentAuthor || userId !== cardAuthor) {
			throw new Error('Unauthorized')
		}

		await prisma.comment.delete({
			where: {
				id: commentId,
				cardId
			}
		})
	} catch (e) {
		console.error(e)
		return (e as Error).message
	}
}

export async function updateComment({
	cardId,
	commentId,
	authorId,
	userId,
	comment
}: {
	cardId: string
	commentId: string
	authorId: string
	userId: string
	comment: string
}) {
	try {
		if (userId !== authorId) {
			throw new Error('Unauthorized')
		}

		const updatedComment = await prisma.comment.update({
			where: {
				cardId,
				id: commentId
			},
			data: {
				text: comment
			}
		})
		return { updatedComment }
	} catch (e) {
		console.error((e as Error).message)
		return (e as Error).message
	}
}
