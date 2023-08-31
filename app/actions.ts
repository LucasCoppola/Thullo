'use server'

import { revalidatePath } from 'next/cache'
import { addMember, removeMember } from './server/membersOperations'
import {
	createBoard,
	updateVisibility,
	updateBoardDescription
} from './server/boardsOperations'
import { BoardMemberRelation, BoardProps, VisibilityMutation } from './types'

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
}: BoardMemberRelation) {
	try {
		const { addMemberToBoard, e } = await addMember({
			boardId,
			userId,
			authorId,
			currUserId
		})
		revalidatePath(`/boards/${boardId}`)
		return { addMemberToBoard, e }
	} catch (e) {
		return { e }
	}
}

export async function removeMemberAction({
	boardId,
	userId,
	authorId,
	currUserId
}: BoardMemberRelation) {
	try {
		await removeMember({
			boardId,
			userId,
			authorId,
			currUserId
		})
		revalidatePath(`/boards/${boardId}`)
	} catch (e) {
		return { e }
	}
}

export async function updateBoardDescriptionAction({
	boardId,
	description,
	authorId,
	currUserId
}: {
	boardId: string
	description: string
	authorId: string
	currUserId: string
}) {
	await updateBoardDescription({ boardId, description, authorId, currUserId })
	revalidatePath(`/boards/${boardId}`)
}
