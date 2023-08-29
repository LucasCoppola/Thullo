'use server'

import { revalidatePath } from 'next/cache'
import { addMember } from './server/membersOperations'
import { createBoard, updateVisibility } from './server/boardsOperations'
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

export async function addMemberAction({
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
		const { addMemberToBoard } = await addMember({
			boardId,
			userId,
			authorId,
			currUserId
		})
		revalidatePath(`/boards/${boardId}`)
		return { addMemberToBoard }
	} catch (e) {
		return { e }
	}
}
