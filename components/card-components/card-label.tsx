import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Tags } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLabel } from '@/app/server/card-operations/labels'
import MutateLable from './mutate-label'

import type { ColorProps } from '@/app/types'
import type { Label } from '@prisma/client'
import { toast } from 'sonner'

export const colors: ColorProps[] = [
	{ color: { text: '#4b5563', bg: '#f3f4f6' }, colorName: 'Gray' },
	{ color: { text: '#dc2626', bg: '#fee2e2' }, colorName: 'Red' },
	{ color: { text: '#2563eb', bg: '#dbeafe' }, colorName: 'Blue' },
	{ color: { text: '#16a34a', bg: '#dcfce7' }, colorName: 'Green' },
	{ color: { text: '#ea580c', bg: '#ffedd5' }, colorName: 'Orange' },
	{ color: { text: '#ca8a04', bg: '#fef9c3' }, colorName: 'Yellow' },
	{ color: { text: '#db2777', bg: '#fce7f3' }, colorName: 'Pink' },
	{ color: { text: '#9333ea', bg: '#f3e8ff' }, colorName: 'Purple' }
]

export default function AddLabel({ cardId, labels }: { cardId: string; labels: Label[] }) {
	const [label, setLabel] = useState('')
	const [previewColor, setPreviewColor] = useState<ColorProps | null>(null)
	const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null)
	const [openDropdown, setOpenDropdown] = useState(false)
	const queryClient = useQueryClient()

	const handleQueryInvalidation = (cardId: string) => {
		queryClient.invalidateQueries(['labels', cardId])
	}

	useEffect(() => {
		setPreviewColor(colors[Math.floor(Math.random() * colors.length)] || null)
	}, [])

	const createLabelMutation = useMutation(
		async () => {
			const color = previewColor || {
				color: { text: '#2563eb', bg: '#dbeafe' },
				colorName: 'Blue'
			}
			await createLabel({ cardId, color, name: label })
		},
		{
			onError: (e) => toast.error((e as Error).message),
			onSettled: () => {
				handleQueryInvalidation(cardId)
				setLabel('')
			}
		}
	)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded-md w-4/5">
					<Tags className="h-4 w-4 mr-2" />
					Labels
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<input
					type="text"
					placeholder="Search for a label..."
					className="bg-gray-50 border text-xs border-gray-300 text-gray-800 rounded-md w-full px-2 py-1 focus:outline-none focus:ring-2 hover:ring-1 hover:ring-blue-200 focus:ring-blue-200 my-1"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
				/>
				<span className="text-xs text-gray-700 font-medium">Select a label or create one</span>
				<ul className="text-xs">
					{labels.length > 0 &&
						labels?.map(({ id, name, color }) => {
							const parsedColor = JSON.parse(JSON.stringify(color)) as ColorProps

							return (
								<li
									key={id}
									className={`hover:bg-gray-100 rounded-sm py-1 px-2 cursor-pointer flex flex-row justify-between ${
										hoveredLabelId === id ? 'bg-gray-100' : ''
									}`}
									onMouseEnter={() => setHoveredLabelId(id)}
									onMouseLeave={() => setHoveredLabelId(null)}
								>
									<span
										className="text-[10px] rounded-sm px-2 py-[1px]"
										style={{
											backgroundColor: parsedColor.color.bg,
											color: parsedColor.color.text
										}}
									>
										{name}
									</span>
									<DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
										<DropdownMenuTrigger asChild>
											{hoveredLabelId === id && (
												<MoreHorizontal
													className="h-4 w-4 text-gray-500 hover:bg-gray-200 rounded-sm"
													strokeWidth={2.5}
												/>
											)}
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<MutateLable
												cardId={cardId}
												color={parsedColor}
												labelId={id}
												name={name}
												setOpenDropdown={setOpenDropdown}
												setQueryInvalidation={handleQueryInvalidation}
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</li>
							)
						})}

					{label && (
						<div
							className="text-xs hover:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer mt-2"
							role="button"
							onClick={() => createLabelMutation.mutate()}
						>
							Create
							<span
								className="text-[10px] text-emerald-600 bg-emerald-100 rounded-sm px-2 py-[1px] ml-1"
								style={{
									backgroundColor: previewColor?.color.bg,
									color: previewColor?.color.text
								}}
							>
								{label}
							</span>
						</div>
					)}
				</ul>
			</PopoverContent>
		</Popover>
	)
}
