'use server'

import prisma from '@/lib/prisma'

export async function createList({ authorId, boardId, title }: { authorId: string; boardId: string; title: string }) {
	try {
		const listsLength = (await getLists({ boardId })).length

		const createList = await prisma.list.create({
			data: {
				authorId,
				boardId,
				title,
				position: listsLength + 1
			}
		})

		return { createList }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function getLists({ boardId }: { boardId: string }) {
	try {
		const lists = await prisma.list.findMany({
			where: {
				boardId
			}
		})

		return lists
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function updateListTitle({ listId, title }: { listId: string; title: string }) {
	try {
		const list = await prisma.list.update({
			where: {
				id: listId
			},
			data: {
				title
			}
		})

		return { list }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function findListById({ listId }: { listId: string }) {
	try {
		const list = await prisma.list.findUnique({
			where: {
				id: listId
			}
		})

		return list
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function removeList({
	listId,
	boardAuthorId,
	listAuthorId,
	userId
}: {
	listId: string
	boardAuthorId: string
	listAuthorId: string
	userId: string
}) {
	try {
		if (listAuthorId !== userId && boardAuthorId !== userId) {
			throw new Error('Unauthorized')
		}

		await prisma.list.delete({
			where: {
				id: listId
			}
		})
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function updateListOrder({
	boardId,
	listOrder
}: {
	boardId: string
	listOrder: { id: string; position: number }[]
}) {
	try {
		for (let i = 0; i < listOrder.length; i++) {
			const listPosition = listOrder[i]?.position
			const listId = listOrder[i]?.id

			await prisma.list.update({
				where: { id: listId, boardId },
				data: { position: listPosition }
			})
		}
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
