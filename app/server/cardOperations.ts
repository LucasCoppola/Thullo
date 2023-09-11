'use server'

import prisma from '@/lib/prisma'

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
	title
}: {
	listId: string
	title: string
}) {
	try {
		const createCard = await prisma.card.create({
			data: {
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
