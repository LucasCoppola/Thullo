import {
	Dialog,
	DialogContent,
	DialogDescription
} from '@/components/ui/dialog'
import { Activity, Paperclip } from 'lucide-react'
import { Comment, SendComment } from './comment'
import { Add } from '../ui/icons'
import Image from 'next/image'
import Attachment from './attachment'
import CardDescription from './card-description'
import CardMembers from './card-members'
import CoverImage from './card-cover-image'
import AddLabel from './card-label'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createCard } from '@/app/server/cardOperations'
import type { Card, User } from '@prisma/client'

export default function CardModal({
	open,
	setOpen,
	card,
	cardMembers
}: {
	open: boolean
	setOpen: (val: boolean) => void
	card: Card
	cardMembers: User[]
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="overflow-y-auto max-h-[80vh] max-w-2xl">
				<DialogDescription asChild>
					<>
						<Image
							src="https://images.unsplash.com/photo-1693856757774-e749742aefe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
							alt="unsplash random image"
							width={400}
							height={400}
							className="w-full h-32 object-cover rounded-lg"
						/>
						<div className="flex flex-row">
							<div className="w-4/6">
								<h1 className="font-medium">{card.title}</h1>
								<h2 className="text-xs text-gray-600 mt-1 mb-4">
									in list <strong>In Progress</strong>
								</h2>
								<CardDescription
									cardDescription="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, officiis ullam fugiat consectetur doloremque tempore recusandae! Harum soluta necessitatibus rem eligendi veritatis molestias doloribus, doloremque, quis veniam nam inventore qui.
					Voluptatem temporibus nisi harum dolorem dolorum beatae explicabo, assumenda soluta hic fuga mollitia non nulla aliquam. Corrupti minima voluptatem fugit aliquid. Cum animi accusantium officia. Alias eligendi sapiente voluptatibus aliquam!"
									cardDescriptionMutation=""
								/>

								<div className="text-xs font-medium text-gray-600 flex flex-row items-center mb-4">
									<Paperclip className="h-3.5 w-3.5 mr-1" />
									Attachments
									<span className="text-[10px] ml-3 p-0.5 rounded-sm text-gray-500 cursor-pointer hover:bg-gray-100 flex flex-row items-center">
										<Add className="h-3.5 w-3.5 mr-0.5" />
										Add attachment
									</span>
								</div>
								<Attachment />

								<span className="text-xs font-medium text-gray-600 flex flex-row items-center mt-4 mb-2">
									<Activity className="h-3.5 w-3.5 mr-1" />
									Activity
								</span>
								<Comment />
								<SendComment />
							</div>

							<div className="flex flex-col w-2/6 gap-3 items-end">
								<CardMembers />
								<AddLabel />
								<CoverImage />
							</div>
						</div>
					</>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}

export function AddCard({
	setCreateMode,
	listId
}: {
	setCreateMode: (val: boolean) => void
	listId: string
}) {
	const [cardTitle, setCardTitle] = useState('')
	const isCardTitleValid = cardTitle.trim().length >= 1

	const { mutate: mutateCardTitle, isLoading } = useMutation(
		async () => await createCard({ listId, title: cardTitle }),
		{
			onSuccess: () => {
				console.log('Card created')
				setCreateMode(false)
			},
			onError: (e) => {
				console.error(e)
			}
		}
	)
	return (
		<form
			className="mt-4 bg-blue-50 items-center px-2.5 py-2 rounded-md h-20"
			style={{ minWidth: '243px' }}
		>
			<input
				type="text"
				placeholder="Enter card title..."
				className="border-2 border-blue-200 px-2 py-0.5 mb-1 rounded-sm focus:outline-none"
				value={cardTitle}
				onChange={(e) => setCardTitle(e.target.value)}
				disabled={isLoading}
				required
			/>
			<div className="flex flex-row gap-2 mt-0.5">
				<button
					className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
					onClick={() => {
						if (isCardTitleValid) mutateCardTitle()
					}}
					disabled={isLoading}
				>
					Add List
				</button>
				<button
					className="text-sm text-gray-600"
					onClick={() => setCreateMode(false)}
				>
					Cancel
				</button>
			</div>
		</form>
	)
}
