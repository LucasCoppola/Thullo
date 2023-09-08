import { ArrowUpCircle } from 'lucide-react'
import { useState } from 'react'

export function SendComment() {
	const [comment, setComment] = useState('')
	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className="border-b border-gray-300 pb-3 w-full">
			<div className="flex flex-row items-center h-10">
				<img
					src="https://avatars.dicebear.com/api/micah/lucas.svg"
					alt=""
					className="h-8 w-8 rounded-full object-cover mr-2"
				/>
				<div className="w-full relative flex items-center">
					{isEditing || comment.length > 0 ? (
						<div className="absolute flex flex-row w-full">
							<input
								placeholder="Add a comment..."
								className="w-full text-xs text-gray-900 p-1.5 outline-none"
								value={comment}
								onBlur={() => setIsEditing(false)}
								onChange={(e) => setComment(e.target.value)}
								autoFocus
								required
							/>
							<ArrowUpCircle
								role={`${
									comment.length > 0 ? 'button' : 'none'
								}`}
								color={`${
									comment.length > 0 ? 'blue' : 'gray'
								}`}
								className="relative top-1 right-0"
							/>
						</div>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="w-full text-xs text-gray-400 rounded-sm p-1.5 hover:bg-gray-100 flex justify-start text-left"
						>
							Add a comment...
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export function Comment() {
	return (
		<div className="w-full mb-2">
			<div className="flex flex-row items-center">
				<img
					src="https://avatars.dicebear.com/api/micah/lucas.svg"
					alt=""
					className="h-8 w-8 rounded-full object-cover mr-2"
				/>
				<div className="flex flex-col w-full">
					<div className="flex flex-row justify-between items-center">
						<h2 className="text-xs font-medium">John Wick</h2>
						<div>
							<span
								role="button"
								className="text-[10px] text-gray-500 hover:underline mr-2"
							>
								Edit
							</span>
							<span
								role="button"
								className="text-[10px] text-gray-500 hover:underline"
							>
								Delete
							</span>
						</div>
					</div>
					<span className="text-[8px] text-gray-500">
						Sep 6 at 11:28 AM
					</span>
				</div>
			</div>
			<p className="pl-10 text-xs text-gray-900 mt-1">
				Once the ideas is clearly defined, the task can move to #todo
				stage.
			</p>
		</div>
	)
}
