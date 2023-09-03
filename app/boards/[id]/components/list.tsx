import { MoreHorizontal } from 'lucide-react'
import Card from './card'
import { AddButtonComponent } from '../page'

export default function List() {
	return (
		<div className="h-96 mt-4" style={{ minWidth: '243px' }}>
			<div className="flex flex-row justify-between pb-4">
				<h2 className="text-gray-800">Title</h2>
				<MoreHorizontal className="text-gray-400" />
			</div>
			<Card />
			<AddButtonComponent name="card" />
		</div>
	)
}
