import { useEffect, useState } from 'react'
import {
	DropdownMenuItem,
	DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { deleteLabel, updateLabel } from '@/app/server/card-operations/labels'
import { colors } from './card-label'
import type { ColorProps } from '@/app/types'

export default function MutateLabel({
	name,
	labelId,
	color,
	cardId,
	refetchLabels,
	setOpenDropdown
}: {
	name: string
	labelId: string
	color: ColorProps
	cardId: string
	refetchLabels: () => void
	setOpenDropdown: (open: boolean) => void
}) {
	const [editLabelName, setEditLabelName] = useState(name)
	const [editColor, setEditColor] = useState(color)

	const deleteLabelMutation = useMutation(
		async () => await deleteLabel({ cardId, labelId }),
		{
			onSuccess: () => {
				refetchLabels()
				console.log('label deleted! (check the db just in case)')
			}
		}
	)

	const updateLabelMutation = useMutation(
		async () => {
			if (editLabelName === name && editColor === color) return

			await updateLabel({
				cardId,
				color: editColor,
				labelId,
				name: editLabelName
			})
		},
		{
			onSettled: () => refetchLabels()
		}
	)

	useEffect(() => {
		if (editLabelName !== name || editColor !== color) {
			updateLabelMutation.mutate()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editLabelName, editColor])

	return (
		<>
			<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
				<input
					type="text"
					className="w-32 p-1 border border-gray-300 text-xs rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
					value={editLabelName}
					onChange={(e) => {
						setEditLabelName(e.target.value)
						updateLabelMutation.mutate()
					}}
					autoFocus
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							setOpenDropdown(false)
						}
					}}
				/>
			</DropdownMenuItem>
			<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<div
							role="button"
							className="flex flex-row items-center text-gray-700 text-xs"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</div>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete this label from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								className="bg-red-500 hover:bg-red-600"
								onClick={() => deleteLabelMutation.mutate()}
							>
								Remove
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<span className="text-gray-500 uppercase text-xs font-medium pl-2">
				Colors
			</span>
			{colors.map(({ color, colorName }) => (
				<DropdownMenuItem
					key={colorName}
					role="button"
					className="flex flex-row items-center py-1"
					onClick={() => {
						setEditColor({ color, colorName })
						updateLabelMutation.mutate()
					}}
				>
					<div
						className="h-4 w-4 rounded-sm border"
						style={{
							backgroundColor: color.bg,
							color: color.text
						}}
					/>
					<span className="text-xs rounded-sm ml-2 py-[1px] text-gray-700">
						{colorName}
					</span>
				</DropdownMenuItem>
			))}
		</>
	)
}
