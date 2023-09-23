import { getAttachments } from '@/app/server/card-operations/attachments'
import { getComments } from '@/app/server/card-operations/comments'
import { getLabels } from '@/app/server/card-operations/labels'
import { getCardMembers } from '@/app/server/membersOperations'
import { findUserById } from '@/app/server/usersOperations'
import { getCoverImage } from '@/app/server/card-operations/coverImage'
import type { User } from '@prisma/client'
import type { CoverImageType } from './types'

export async function fetchAttachments(cardId: string) {
	const { attachments } = await getAttachments({ cardId })
	return attachments
}

export async function fetchComments(cardId: string) {
	const { comments } = await getComments({ cardId })
	return comments
}
export async function fetchLabels(cardId: string) {
	const { labels } = await getLabels({ cardId })
	return labels
}

export async function fetchCardMembers(cardId: string) {
	return (await getCardMembers({ cardId })) as Omit<User, 'email' | 'emailVerified'>[] | undefined
}

export async function fetchCoverImage(cardId: string) {
	return (await getCoverImage(cardId)) as CoverImageType
}

export async function fetchUser(userId: string) {
	const { author: user } = await findUserById({ id: userId })
	return user as Omit<User, 'email' | 'emailVerified'>
}
