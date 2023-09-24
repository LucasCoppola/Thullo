'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createList, updateListTitle } from '@/app/server/boardsOperations'
import EditableTitle from '../shared/editable-title'
import { useSession } from 'next-auth/react'

export default function AddList({
	setCreateMode,
	boardId
}: {
	setCreateMode: (val: boolean) => void
	boardId: string
}) {
	const [listTitle, setListTitle] = useState('')
	const isListTitleValid = listTitle.trim().length >= 1
	const { data: session } = useSession()

	const { mutate: mutateList, isLoading } = useMutation(
		async () =>
			await createList({
				boardId,
				title: listTitle,
				authorId: session?.userId!
			}),
		{
			onSuccess: () => {
				console.log('List created')
				setCreateMode(false)
			},
			onError: (e) => {
				console.error(e)
			}
		}
	)
	return (
		<form className="mt-4 bg-blue-50 items-center px-2.5 py-2 rounded-md h-20" style={{ minWidth: '243px' }}>
			<input
				type="text"
				placeholder="Enter list title..."
				className="border-2 border-blue-200 px-2 py-0.5 mb-1 rounded-sm focus:outline-none"
				value={listTitle}
				onChange={(e) => setListTitle(e.target.value)}
				disabled={isLoading}
				required
			/>
			<div className="flex flex-row gap-2 mt-0.5">
				<button
					className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
					onClick={() => {
						if (isListTitleValid) mutateList()
					}}
					disabled={isLoading}
				>
					Add List
				</button>
				<button className="text-sm text-gray-600" onClick={() => setCreateMode(false)}>
					Cancel
				</button>
			</div>
		</form>
	)
}

export function EditableListTitle({ title: listTitle, listId }: { title: string; listId: string }) {
	const [title, setTitle] = useState(listTitle)

	const { mutate: mutateListTitle, error } = useMutation(async () => await updateListTitle({ listId, title }), {
		onSuccess: () => {
			console.log('List title updated')
		},
		onError: () => {
			console.error(error)
		}
	})
	return (
		<EditableTitle
			initialValue={title}
			onSave={(editedTitle) => {
				if (editedTitle.trim().length === 0) return
				setTitle(editedTitle)
				mutateListTitle()
			}}
			titleClassName="text-lg font-medium px-1 py-0.5 hover:bg-gray-100 rounded-md"
			inputClassName="text-lg font-medium px-0.5"
		/>
	)
}
