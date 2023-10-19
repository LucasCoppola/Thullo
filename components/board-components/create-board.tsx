'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { toast } from 'sonner'
import CoverImageModal from '@/components/cover-image-modal'
import type { BoardVisibility } from '@prisma/client'
import type { CoverImageType } from '@/app/types'
import { createBoard } from '@/app/server/boardsOperations'

type FormDataType = {
	title: string
	coverImage: CoverImageType
	visibility: BoardVisibility
}

const defaultGrayColor = '#adb5bd'

export default function CreateBoard() {
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const [isHovered, setIsHovered] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [formData, setFormData] = useState<FormDataType>({
		coverImage: { type: 'color', bg: defaultGrayColor },
		title: '',
		visibility: 'PUBLIC'
	})

	const { mutate, isLoading } = useMutation(
		async (formData: FormDataType) => {
			if (!session) return
			const { title, visibility, coverImage } = formData
			await createBoard({
				authorId: session.userId,
				title,
				coverImage,
				visibility
			})
		},
		{
			onSuccess: () => {
				setIsDialogOpen(false)
				toast.success('Board created successfully!')
				queryClient.invalidateQueries(['boards', session?.userId])
				setFormData({
					coverImage: { type: 'color', bg: defaultGrayColor },
					title: '',
					visibility: 'PUBLIC'
				})
			},
			onError: (e) => {
				toast.error('Error creating board!')
				setIsDialogOpen(false)
				setFormData({
					coverImage: { type: 'color', bg: defaultGrayColor },
					title: '',
					visibility: 'PUBLIC'
				})
			}
		}
	)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (formData.title.trim() === '') {
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
				<Button variant={'blue'}>
					<Add className="mr-2 h-5 w-5" /> Add
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[350px] md:w-auto">
				<DialogHeader className="w-[300px] md:w-auto">
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
											backgroundColor: formData.coverImage.bg || defaultGrayColor
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
									setCoverImage={(newCoverImage) => {
										setFormData({
											...formData,
											coverImage: { ...newCoverImage }
										})
									}}
									coverImage={formData.coverImage}
									triggerButton={
										<span
											className={`absolute top-0 right-0 bg-gray-100 p-1.5 cursor-pointer text-center text-xs rounded-es-lg rounded-se-lg font-medium text-gray-700 ${
												isHovered
													? 'opacity-100 visibility-visible transition-opacity duration-300 ease-in-out'
													: 'opacity-0 visibility-hidden transition-opacity duration-300 ease-in-out'
											}`}
										>
											Change cover
										</span>
									}
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
							</div>

							<div className="flex flex-col space-y-2">
								<div className="flex items-center">
									<input
										id="public-radio"
										type="radio"
										value="PUBLIC"
										name="visibility"
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
										checked={formData.visibility === 'PUBLIC'}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target.value as BoardVisibility
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
										checked={formData.visibility === 'PRIVATE'}
										onChange={(e) =>
											setFormData({
												...formData,
												visibility: e.target.value as BoardVisibility
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

							<Button type="submit" disabled={isLoading} variant="blue" className="ml-52 md:ml-96">
								{isLoading ? <LoadingCircle className="fill-white mx-4 text-blue-200" /> : 'Create'}
							</Button>
						</DialogDescription>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
