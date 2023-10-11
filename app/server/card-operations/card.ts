'use server'

import prisma from '@/lib/prisma'

export async function getAllBoardCards({ boardId }: { boardId: string }) {
	try {
		const lists = await prisma.list.findMany({ where: { boardId } })

		const cards = await Promise.all(lists.map(async (list) => await getCards({ listId: list.id })))

		return cards.flat()
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
getAllBoardCards({ boardId: 'clmnn9el00006ilswfkwvpv3r' })

export async function getCards({ listId }: { listId: string }) {
	try {
		const cards = await prisma.card.findMany({
			where: {
				listId
			}
		})

		return cards
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function createCard({ listId, title, authorId }: { listId: string; title: string; authorId: string }) {
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
		throw (e as Error).message
	}
}

export async function removeCard({
	userId,
	cardAuthorId,
	boardAuthorId,
	cardId
}: {
	userId: string
	cardAuthorId: string
	boardAuthorId: string
	cardId: string
}) {
	try {
		if (cardAuthorId !== userId && boardAuthorId !== userId) {
			throw new Error('Unauthorized')
		}

		await prisma.card.delete({
			where: {
				id: cardId
			}
		})
	} catch (e) {
		console.error(e)
		throw (e as Error).message
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
		throw (e as Error).message
	}
}

export async function updateCardTitle({
	userId,
	authorId,
	cardId,
	title
}: {
	userId: string
	authorId: string
	cardId: string
	title: string
}) {
	try {
		if (userId !== authorId) throw new Error('Unauthorized')

		const updateTitle = await prisma.card.update({
			where: {
				id: cardId
			},
			data: {
				title
			}
		})

		return updateTitle
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
