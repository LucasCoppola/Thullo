import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Add } from '@/components/ui/icons'

export default function Boards() {
	return (
		<>
			<div className="flex justify-between w-full mt-14 mb-4">
				<h1 className="text-lg font-medium text-gray-800">
					All Boards
				</h1>
				<Button className="bg-blue-500 hover:bg-blue-600 rounded-lg">
					<Add className="mr-2 h-5 w-5" /> Add
				</Button>
			</div>
			<Card />
		</>
	)
}
