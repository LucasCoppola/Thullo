'use server'

import { revalidatePath } from 'next/cache'
import { addMember, removeMember } from './server/membersOperations'
import {
	createBoard,
	createList,
	updateVisibility
} from './server/boardsOperations'
import { Prisma } from '@prisma/client'
import { CreateBoardType, VisibilityMutation } from './types'

export async function createBoardAction({
	authorId,
	title,

	visibility,
	coverImage
}: CreateBoardType & {
	coverImage: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue
}) {
	await createBoard({
		authorId,
		title,
		visibility,
		coverImage
	})
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
}: {
	boardId: string
	userId: string
	authorId: string
	currUserId: string
}) {
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
