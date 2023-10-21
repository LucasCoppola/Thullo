'use server'

import prisma from '@/lib/prisma'

export async function getComments({ cardId }: { cardId: string }) {
	try {
		const comments = await prisma.comment.findMany({
			orderBy: {
				createdAt: 'asc'
			},
			where: {
				cardId
			}
		})

		return { comments }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function addComment({ cardId, authorId, comment }: { cardId: string; authorId: string; comment: string }) {
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
		throw (e as Error).message
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
		throw (e as Error).message
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
		console.error(e)
		throw (e as Error).message
	}
}
