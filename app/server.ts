'use server'

import prisma from '@/lib/prisma'
import { BoardVisibility } from '@prisma/client'

export type CreateBoardProps = {
	authorId: string
	title: string
	coverImage: {
		type: 'color' | 'image'
		bg: string
	}
	visibility: BoardVisibility
	description?: string
}

export async function createBoard({
	authorId,
	title,
	description,
	coverImage,
	visibility
}: CreateBoardProps) {
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
