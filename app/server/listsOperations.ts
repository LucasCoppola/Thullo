'use server'

import prisma from '@/lib/prisma'

export async function createList({ authorId, boardId, title }: { authorId: string; boardId: string; title: string }) {
	try {
		const createList = await prisma.list.create({
			data: {
				authorId,
				boardId,
				title
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
		if (listAuthorId !== userId) {
			throw new Error('Unauthorized')
		}

		if (boardAuthorId !== userId) {
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
