'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { BoardProps, VisibilityMutation } from '../types'

export async function getBoards({ userId }: { userId: string }) {
	try {
		const boards = await prisma.board.findMany({
			where: {
				authorId: userId
			}
		})

		return boards
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function createBoard({
	authorId,
	title,
	description,
	coverImage,
	visibility
}: BoardProps) {
	try {
		const board = await prisma.board.create({
			data: {
				authorId,
				title,
				description,
				coverImage,
				visibility
			}
		})

		return { board }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function findBoardById({ id }: { id: string }) {
	try {
		const board = await prisma.board.findUnique({
			where: {
				id
			}
		})
		const modifiedBoard = board
			? {
					...board,
					coverImage: board.coverImage as Prisma.InputJsonValue
			  }
			: null

		return { board: modifiedBoard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function updateVisibility({
	boardId,
	visibility,
	authorId,
	currUserId
}: VisibilityMutation) {
	try {
		if (authorId !== currUserId) {
			throw new Error('Unauthorized')
		}
		const updatedBoard = await prisma.board.update({
			where: {
				id: boardId
			},
			data: {
				visibility
			}
		})

		return { updatedBoard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function updateBoard({
	boardId,
	description,
	title,
	authorId,
	currUserId
}: {
	boardId: string
	description?: string
	title?: string
	authorId: string
	currUserId: string
}) {
	try {
		if (!description && !title) {
			throw new Error('Either description or title is required.')
		}
		if (authorId !== currUserId) {
			throw new Error('Unauthorized')
		}

		const updatedData = {} as { title: string; description: string }

		if (title) {
			updatedData.title = title
		}
		if (description) {
			updatedData.description = description
		}

		const updatedBoard = await prisma.board.update({
			where: {
				id: boardId
			},
			data: updatedData
		})

		return { updatedBoard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function createList({
	boardId,
	title
}: {
	boardId: string
	title: string
}) {
	try {
		const createList = await prisma.list.create({
			data: {
				boardId,
				title
			}
		})

		return { createList }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function getLists({ boardId }: { boardId: string }) {
	try {
		const lists = await prisma.list.findMany({
			where: {
				boardId
			}
		})

		return { lists }
	} catch (e) {
		console.error(e)
		return { e }
	}
}
