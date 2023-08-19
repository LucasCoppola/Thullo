'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import CoverImageModal from '@/components/boards/cover-image-modal'
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
	const [coverImage, setCoverImage] = useState<{
		type: 'color' | 'image'
		bg: string
	}>({
		type: 'color',
		bg: '#adb5bd'
	})
	const [formData, setFormData] = useState({
		coverImage: coverImage.bg,
		title: '',
		visibility: 'public'
	})
	const [error, setError] = useState('')

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (formData.title.trim() === '') {
			setError('Title cannot be empty')
			return
		}

		setError('')
		console.log(formData)
	}

	useEffect(() => {
		setFormData({
			...formData,
			coverImage: coverImage.bg
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coverImage])

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
					<form onSubmit={handleSubmit}>
						<DialogDescription className="w-full space-y-4">
							<div
								onMouseOver={() => setIsHovered(true)}
								onMouseOut={() => setIsHovered(false)}
								className="relative transition-all"
							>
								{coverImage.type === 'color' ? (
									<div
										className="w-full h-40 rounded-xl"
										style={{
											backgroundColor:
												coverImage.bg || '#adb5bd'
										}}
									></div>
								) : (
									<Image
										className="w-full h-40 rounded-xl object-cover"
										src={coverImage.bg}
										alt="Board cover image"
										width={200}
										height={50}
									/>
								)}
								<CoverImageModal
									isHovered={isHovered}
									setCoverImage={setCoverImage}
									coverImage={coverImage}
								/>
							</div>
							<div>
								<input
									className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
									placeholder="Add a board title"
									name="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value
										})
									}
									required
								/>
								{error && (
									<p className="mt-1 text-red-500">{error}</p>
								)}
							</div>

							<div className="flex flex-col space-y-2">
								<div className="flex items-center">
									<input
										id="public-radio"
										type="radio"
										value="public"
										name="visibility"
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
										checked={
											formData.visibility === 'public'
										}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target.value
											})
										}
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
										checked={
											formData.visibility === 'private'
										}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target.value
											})
										}
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
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
