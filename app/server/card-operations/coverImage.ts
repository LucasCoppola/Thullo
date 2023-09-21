'use server'

import type { CoverImageType } from '@/app/types'
import prisma from '@/lib/prisma'

export async function getCoverImage(cardId: string) {
	try {
		const card = await prisma.card.findUnique({
			where: {
				id: cardId
			}
		})

		return card?.coverImage
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function updateCoverImage({
	cardId,
	authorId,
	userId,
	coverImage
}: {
	cardId: string
	authorId: string
	userId: string
	coverImage: CoverImageType
}) {
	try {
		if (userId !== authorId) {
			throw new Error('Unauthorized')
		}

		const card = await prisma.card.findUnique({
			where: {
				id: cardId
			}
		})

		if (!card) {
			throw new Error('Card not found')
		}

		const updatedCard = await prisma.card.update({
			where: {
				id: cardId
			},
			data: {
				coverImage
			}
		})

		return updatedCard
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
