import Card from '@/components/ui/card'
import CreateBoard from './create-board'

export default function Boards() {
	return (
		<>
			<div className="flex justify-between w-full mt-14 mb-4">
				<h1 className="text-lg font-medium text-gray-800">
					All Boards
				</h1>
				<CreateBoard />
			</div>
			<Card />
		</>
	)
}
