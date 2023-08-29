'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { BoardProps, VisibilityMutation } from './types'

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

export async function findUserById({ id }: { id: string }) {
	try {
		const author = await prisma.user.findUnique({
			where: {
				id
			},
			select: { id: true, name: true, image: true }
		})

		return { author }
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

export async function findUsers({
	keyword,
	currUserId
}: {
	keyword: string
	currUserId: string
}) {
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [{ email: keyword }, { name: keyword }],
				AND: { id: { not: currUserId } }
			},
			select: { id: true, name: true, image: true }
		})

		return { users }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function addMember({
	boardId,
	userId,
	authorId,
	currUserId
}: {
	boardId: string
	userId: string
	authorId: string
	currUserId: string
}) {
	try {
		if (authorId !== currUserId) {
			throw new Error('Unauthorized')
		}

		const membersOnBoardId = await prisma.membersOnBoards.findMany({
			where: {
				boardId,
				userId
			}
		})

		const isMemberOnBoard = membersOnBoardId.find(
			(relation) => relation.userId === userId
		)

		if (isMemberOnBoard) {
			throw new Error('User already added')
		}

		const addMemberToBoard = await prisma.membersOnBoards.create({
			data: {
				boardId,
				userId
			}
		})

		return { addMemberToBoard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function getBoardMembers({ boardId }: { boardId: string }) {
	try {
		const boardMemberRelations = await prisma.membersOnBoards.findMany({
			where: { boardId }
		})

		const userIds = boardMemberRelations.map((relation) => relation.userId)

		const members = await prisma.user.findMany({
			where: {
				id: { in: userIds }
			},
			select: {
				id: true,
				name: true,
				image: true
			}
		})

		return { members }
	} catch (error) {
		console.error(error)
		return { error }
	}
}
