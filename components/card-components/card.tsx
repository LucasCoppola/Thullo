import type { User, Card, List } from '@prisma/client'
import { MessageSquare, Paperclip } from 'lucide-react'
import CardModal from './card-modal'

export default async function Card({
	boardMembers,
	card,
	list
}: {
	boardMembers: User[]
	card: Card
	list: List
}) {
	return <CardModal card={card} boardMembers={boardMembers} list={list} />
}
