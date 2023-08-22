'use server'

import prisma from '@/lib/prisma'
import { $Enums, Prisma } from '@prisma/client'

export type BoardProps = {
	id?: string
	createdAt?: Date
	updatedAt?: Date
	authorId: string
	title: string
	description?: string | null
	coverImage: Prisma.InputJsonValue
	visibility: $Enums.BoardVisibility
}

export type AuthorProps =
	| {
			id: string
			name: string | null
			email: string | null
			emailVerified: Date | null
			image: string | null
	  }
	| null
	| undefined

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
			}
		})

		return { author }
	} catch (e) {
		console.error(e)
		return { e }
	}
}
