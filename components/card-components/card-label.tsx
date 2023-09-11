import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Tags, Trash2 } from 'lucide-react'

export default function AddLabel() {
	const [label, setLabel] = useState('')
	const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null)

	const colors = [
		{ color: { text: '#4b5563', bg: '#f3f4f6' }, name: 'Gray' },
		{ color: { text: '#dc2626', bg: '#fee2e2' }, name: 'Red' },
		{ color: { text: '#2563eb', bg: '#dbeafe' }, name: 'Blue' },
		{ color: { text: '#16a34a', bg: '#dcfce7' }, name: 'Green' },
		{ color: { text: '#ea580c', bg: '#ffedd5' }, name: 'Orange' },
		{ color: { text: '#ca8a04', bg: '#fef9c3' }, name: 'Yellow' },
		{ color: { text: '#db2777', bg: '#fce7f3' }, name: 'Pink' },
		{ color: { text: '#9333ea', bg: '#f3e8ff' }, name: 'Purple' }
	]

	const labels = [
		{
			id: 'bveureobveybo8',
			name: 'Technical',
			color: { text: '#16a34a', bg: '#dcfce7' }
		},
		{
			id: 'brwuvbrwu9br',
			name: 'Fast',
			color: { text: '#dc2626', bg: '#fee2e2' }
		},
		{
			id: 'verget',
			name: 'Do it now',
			color: { text: '#2563eb', bg: '#dbeafe' }
		},
		{
			id: 'obveybo8',
			name: 'Critical',
			color: { text: '#ea580c', bg: '#ffedd5' }
		}
	]

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 px-4 py-1.5 rounded-md w-4/5">
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
				<span className="text-xs text-gray-700 font-medium">
					Select a label or create one
				</span>
				{/* these should be the ones on the database */}
				<ul className="text-xs">
					{labels.map(({ id, name, color }) => (
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
									backgroundColor: color.bg,
									color: color.text
								}}
							>
								{name}
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									{hoveredLabelId === id && (
										<MoreHorizontal
											className="h-4 w-4 text-gray-500 hover:bg-gray-200 rounded-sm"
											strokeWidth={2.5}
										/>
									)}
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>
										<div
											role="button"
											className="flex flex-row items-center text-gray-700"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</div>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<span className="text-gray-500 uppercase text-xs font-medium pl-2">
										Colors
									</span>
									{colors.map(({ color, name }) => (
										<DropdownMenuItem
											key={name}
											className="flex flex-row items-center py-1"
										>
											<div
												className="h-4 w-4 rounded-sm border"
												style={{
													backgroundColor: color.bg
												}}
											/>
											<span className="text-xs rounded-sm ml-2 py-[1px] text-gray-700">
												{name}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
					))}

					{label && (
						<div className="text-xs hover:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer mt-2">
							Create
							<span className="text-[10px] text-emerald-600 bg-emerald-100 rounded-sm px-2 py-[1px] ml-1">
								{label}
							</span>
						</div>
					)}
				</ul>
			</PopoverContent>
		</Popover>
	)
}