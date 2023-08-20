'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import { createBoard } from '@/app/server'
import { $Enums } from '@prisma/client'
import { useSession } from 'next-auth/react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Add, LoadingCircle } from '@/components/ui/icons'
import CoverImageModal from '@/components/boards/cover-image-modal'

type FormDataType = {
	title: string
	coverImage: { type: 'color' | 'image'; bg: string }
	visibility: $Enums.BoardVisibility
}

const defaultGrayColor = '#adb5bd'

export default function CreateBoard() {
	const { data } = useSession()
	const [isHovered, setIsHovered] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [error, setError] = useState('')
	const [formData, setFormData] = useState<FormDataType>({
		coverImage: { type: 'color', bg: defaultGrayColor },
		title: '',
		visibility: 'PUBLIC'
	})

	async function createBoardClient(formData: FormDataType) {
		const { title, visibility } = formData
		const coverImage = formData.coverImage || defaultGrayColor
		const authorId = data?.userId || ''

		await createBoard({
			authorId,
			title,
			coverImage,
			visibility
		})
	}

	const { mutate, isLoading } = useMutation(createBoardClient, {
		onSuccess: () => {
			setIsDialogOpen(false)
			setFormData({
				coverImage: { type: 'color', bg: defaultGrayColor },
				title: '',
				visibility: 'PUBLIC'
			})
		},
		onError: (error) => {
			console.error('Mutation error:', error)
			setError('Something went wrong')
		}
	})

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (formData.title.trim() === '') {
			setError('Title cannot be empty')
			return
		}
		mutate(formData)
	}

	useEffect(() => {
		setFormData({
			...formData,
			coverImage: formData.coverImage
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData.coverImage])

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
								{formData.coverImage.type === 'color' ? (
									<div
										className="w-full h-40 rounded-xl"
										style={{
											backgroundColor:
												formData.coverImage.bg ||
												defaultGrayColor
										}}
									></div>
								) : (
									<Image
										className="w-full h-40 rounded-xl object-cover"
										src={formData.coverImage.bg}
										alt="Board cover image"
										width={200}
										height={50}
									/>
								)}
								<CoverImageModal
									isHovered={isHovered}
									setCoverImage={(newCoverImage) => {
										setFormData({
											...formData,
											coverImage: { ...newCoverImage }
										})
									}}
									coverImage={formData.coverImage}
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
									minLength={2}
									maxLength={50}
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
										value="PUBLIC"
										name="visibility"
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
										checked={
											formData.visibility === 'PUBLIC'
										}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target
													.value as $Enums.BoardVisibility
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
										value="PRIVATE"
										name="visibility"
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
										checked={
											formData.visibility === 'PRIVATE'
										}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target
													.value as $Enums.BoardVisibility
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
								disabled={isLoading}
								className="bg-blue-500 ml-96 hover:bg-blue-600 rounded-lg"
							>
								{isLoading ? (
									<LoadingCircle className="fill-white mx-4 text-blue-200" />
								) : (
									'Create'
								)}
							</Button>
						</DialogDescription>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
