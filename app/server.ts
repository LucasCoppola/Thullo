'use server'

import prisma from '@/lib/prisma'
import { $Enums } from '@prisma/client'

export type BoardProps = {
	id?: string
	createdAt?: Date
	updatedAt?: Date
	authorId: string
	title: string
	description?: string | null
	coverImage: {
		type: 'color' | 'image'
		bg: string
	}
	visibility: $Enums.BoardVisibility
}

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
