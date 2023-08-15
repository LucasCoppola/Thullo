'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Add } from '@/components/ui/icons'

export default function CreateBoard() {
	const [isHovered, setIsHovered] = useState(false)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="bg-blue-500 hover:bg-blue-600 rounded-lg">
					<Add className="mr-2 h-5 w-5" /> Add
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="mb-3">Create Board</DialogTitle>
					<DialogDescription className="space-y-4 w-full">
						<div
							onMouseOver={() => setIsHovered(true)}
							onMouseOut={() => setIsHovered(false)}
							className="relative"
						>
							<Image
								className="w-full h-40 rounded-xl"
								src="https://res.cloudinary.com/dotpfjpno/image/upload/v1675864626/YelpCamp/yrwrxu55rg5bdfgyrzcc.jpg"
								alt=""
								width={200}
								height={50}
							/>
							{isHovered && (
								<span className="absolute top-0 right-0 bg-gray-100 p-1.5 cursor-pointer hover:bg-gray-200 transition-all duration-200 ease-in-out text-center text-xs rounded-es-lg rounded-se-lg font-medium text-gray-700">
									Change cover
								</span>
							)}
						</div>
						<input
							className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5"
							placeholder="Add a board title"
							required
						/>

						<div className="flex flex-col space-y-2">
							<div className="flex items-center">
								<input
									id="public-radio"
									type="radio"
									value="public"
									name="visibility"
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
									checked
								/>
								<label
									htmlFor="public-radio"
									className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
								>
									Public
								</label>
							</div>

							<div className="flex items-center">
								<input
									id="private-radio"
									type="radio"
									value="private"
									name="visibility"
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
								/>
								<label
									htmlFor="private-radio"
									className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
								>
									Private
								</label>
							</div>
						</div>

						<Button
							type="submit"
							className="bg-blue-500 ml-96 hover:bg-blue-600 rounded-lg"
						>
							Create
						</Button>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
