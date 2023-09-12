import type { User, Card, List, Attachment } from '@prisma/client'
import { MessageSquare, Paperclip } from 'lucide-react'
import CardModal from './card-modal'
import { getAttachments } from '@/app/server/cardOperations'

export default async function Card({
	boardMembers,
	card,
	list
}: {
	boardMembers: User[]
	card: Card
	list: List
}) {
	const { attachments } = await getAttachments({ cardId: card.id })
	return (
		<CardModal
			card={card}
			boardMembers={boardMembers}
			attachments={attachments as Attachment[]}
			list={list}
		/>
	)
}
