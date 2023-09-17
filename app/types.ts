import { type Board, BoardVisibility } from '@prisma/client'

export type ImageData = {
	id: string
	alt: string
	urls: { small: string }
	user: { id: string; username: string; links: { html: string } }
}

export type VisibilityMutation = {
	visibility: BoardVisibility
	boardId: string
	authorId: string
	currUserId: string
}

export type CreateBoardType = Omit<
	Board,
	'id' | 'createdAt' | 'updatedAt' | 'description'
>

export type ColorProps = {
	color: {
		text: string
		bg: string
	}
	colorName: string
}
