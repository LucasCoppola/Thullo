'use client'

import { useState } from 'react'
import { Add } from '@/components/ui/icons'
import { useMutation } from '@tanstack/react-query'
import { createList } from '@/app/server/boardsOperations'

export default function AddList({
	setCreateMode,
	boardId
}: {
	setCreateMode: (val: boolean) => void
	boardId: string
}) {
	const [listTitle, setListTitle] = useState('')

	const { mutate } = useMutation(
		async () => await createList({ boardId, title: listTitle }),
		{
			onSuccess: () => {
				console.log('List created')
				setCreateMode(false)
			},
			onError: (e) => {
				console.log(e)
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
				placeholder="Enter list title..."
				className="border-2 border-blue-200 px-2 py-0.5 mb-1 rounded-sm focus:outline-none"
				value={listTitle}
				onChange={(e) => setListTitle(e.target.value)}
				required
			/>
			<div className="flex flex-row gap-2 mt-0.5">
				<button
					className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
					onClick={() => mutate()}
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

export function AddButtonComponent({
	name,
	boardId
}: {
	name: 'card' | 'list'
	boardId: string
}) {
	const [createMode, setCreateMode] = useState(false)

	return (
		<>
			{createMode && name === 'list' ? (
				<AddList setCreateMode={setCreateMode} boardId={boardId} />
			) : createMode && name === 'card' ? (
				<h1>Create Card Modal</h1>
			) : (
				<button
					className="mt-4 flex flex-row bg-blue-50 h-8 items-center px-2.5 py-1 rounded-lg hover:bg-blue-100"
					style={{ minWidth: '243px' }}
					onClick={() => setCreateMode(true)}
				>
					<span className="text-blue-400 text-sm">
						Add another {name}
					</span>
					<Add
						className="text-blue-300 ml-auto w-5 h-5"
						strokeWidth={1.5}
					/>
				</button>
			)}
		</>
	)
}
