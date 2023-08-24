'use server'

import { revalidatePath } from 'next/cache'
import { createBoard, updateVisibility } from './server'
import { BoardProps, VisibilityMutation } from './types'

export async function createBoardAction({
	authorId,
	title,
	coverImage,
	visibility
}: BoardProps) {
	await createBoard({ authorId, title, coverImage, visibility })
	revalidatePath('/boards')
}

export async function updateVisibilityAction({
	boardId,
	visibility,
	authorId,
	currUserId
}: VisibilityMutation) {
	await updateVisibility({ boardId, visibility, authorId, currUserId })
	revalidatePath(`/boards/${boardId}`)
}
