'use client'

import { useState } from 'react'
import AddList from './list-components/add-list'
import { Add } from './ui/icons'
import { AddCard } from './card-components/card-modal'

export default function AddButtonComponent({
	name,
	boardId,
	listId
}: {
	name: 'card' | 'list'
	boardId: string
	listId: string
}) {
	const [createMode, setCreateMode] = useState(false)

	return (
		<>
			{createMode && name === 'list' ? (
				<AddList setCreateMode={setCreateMode} boardId={boardId} />
			) : createMode && name === 'card' ? (
				<AddCard setCreateMode={setCreateMode} listId={listId} />
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
