'use server'

import { revalidatePath } from 'next/cache'
import { BoardProps, createBoard } from './server'

export async function createBoardAction({
	authorId,
	title,
	coverImage,
	visibility
}: BoardProps) {
	await createBoard({ authorId, title, coverImage, visibility })
	revalidatePath('/boards')
}
