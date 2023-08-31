import { $Enums, Prisma } from '@prisma/client'

export type BoardProps = {
	id?: string
	createdAt?: Date
	updatedAt?: Date
	authorId: string
	title: string
	description?: string | null
	coverImage: { type: 'color' | 'image'; bg: string } | Prisma.InputJsonValue
	visibility: $Enums.BoardVisibility
}

export type AuthorProps =
	| {
			id: string
			name: string | null
			image: string | null
	  }
	| null
	| undefined

export type VisibilityMutation = {
	visibility: $Enums.BoardVisibility
	boardId: string
	authorId: string
	currUserId: string
}

export type User = {
	id: string
	name: string | null
	image: string | null
}

export type BoardMemberRelation = {
	boardId: string
	userId: string
	authorId: string
	currUserId: string
}
