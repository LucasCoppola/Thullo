'use server'

import prisma from '@/lib/prisma'

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

export async function removeMember({
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
		if (authorId === userId) {
			throw new Error("You can't delete the author")
		}
		if (currUserId === userId) {
			throw new Error("You can't delete yourself")
		}

		await prisma.membersOnBoards.deleteMany({
			where: {
				boardId,
				userId
			}
		})
		return { success: true }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function getCardMembers({ cardId }: { cardId: string }) {
	try {
		const cardMemberRelations = await prisma.membersOnCards.findMany({
			where: { cardId }
		})

		const userIds = cardMemberRelations.map((relation) => relation.userId)

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

		return members
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function addCardMember({
	cardId,
	authorId,
	userId,
	currUserId
}: {
	cardId: string
	authorId: string
	userId: string
	currUserId: string
}) {
	try {
		if (authorId !== currUserId) {
			throw new Error('Unauthorized')
		}
		if (userId === authorId) {
			throw new Error("You can't add yourself")
		}
		const cardMembers = await getCardMembers({ cardId })

		const isMemberOnCard = cardMembers.find(
			(relation) => relation.id === userId
		)

		if (isMemberOnCard) {
			throw new Error('User already added')
		}

		const addCardMember = await prisma.membersOnCards.create({
			data: {
				cardId,
				userId
			}
		})

		return addCardMember
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
