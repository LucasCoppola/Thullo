'use server'

import prisma from '@/lib/prisma'
import { Prisma, type Board } from '@prisma/client'
import type { CreateBoardType, VisibilityMutation } from '../types'
import { revalidatePath } from 'next/cache'

type coverImageType = Prisma.NullTypes.JsonNull | Prisma.InputJsonValue

export async function getBoards({ userId }: { userId: string }) {
	try {
		const ownedBoards = await prisma.board.findMany({
			where: {
				authorId: userId
			}
		})

		const notOwnedBoardsIds = await prisma.membersOnBoards.findMany({
			where: {
				userId
			}
		})

		const notOwnedBoards = (await Promise.all(
			notOwnedBoardsIds.map(({ boardId }) => findBoardById({ id: boardId }))
		)) as Board[]

		return ownedBoards.concat(notOwnedBoards)
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function createBoard({
	authorId,
	title,
	visibility,
	coverImage
}: CreateBoardType & { coverImage: coverImageType }) {
	try {
		const board = await prisma.board.create({
			data: {
				authorId,
				title,
				visibility,
				coverImage
			}
		})

		return { board }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
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

		return modifiedBoard as Board
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function deleteBoard({
	boardId,
	authorId,
	currUserId
}: {
	boardId: string
	authorId: string
	currUserId: string
}) {
	try {
		if (currUserId !== authorId) {
			throw new Error('Unauthorized')
		}

		await prisma.board.delete({
			where: {
				id: boardId
			}
		})
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function updateVisibility({ boardId, visibility, authorId, currUserId }: VisibilityMutation) {
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
		throw (e as Error).message
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
		throw (e as Error).message
	}
}
