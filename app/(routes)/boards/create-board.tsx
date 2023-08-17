'use client'

import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Add, LoadingCircle, Search } from '@/components/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

type ImageData = {
	id: string
	alt: string
	urls: { small: string }
	user: { id: string; username: string; links: { html: string } }
}

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
							className="relative transition-all"
						>
							<Image
								className="w-full h-40 rounded-xl"
								src="https://res.cloudinary.com/dotpfjpno/image/upload/v1675864626/YelpCamp/yrwrxu55rg5bdfgyrzcc.jpg"
								alt=""
								width={200}
								height={50}
							/>
							<CoverImageModal isHovered={isHovered} />
						</div>
						<input
							className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg w-full p-2.5 focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
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

export function CoverImageModal({ isHovered }: { isHovered: boolean }) {
	const [query, setQuery] = useState('')

	const {
		isLoading: isLoadingRandom,
		isError: isErrorRandom,
		data: dataRandom
	} = useQuery(['randomImages'], async () => {
		const randomImages = await axios.get(
			`https://api.unsplash.com/photos/?per_page=20&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
		)
		const randomImage: ImageData[] = await randomImages.data
		return randomImage
	})

	const {
		isFetching,
		isError: isErrorSearch,
		data: dataSearch
	} = useQuery(['searchImages', query], async () => {
		if (!query) return []
		const searchImages = await axios.get(
			`https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
		)
		const searchImage: ImageData[] = await searchImages.data.results
		return searchImage
	})
	const alwaysTrue = true
	console.log(isErrorRandom, isErrorSearch)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<span
					className={`absolute top-0 right-0 bg-gray-100 p-1.5 cursor-pointer text-center text-xs rounded-es-lg rounded-se-lg font-medium text-gray-700 ${
						isHovered
							? 'opacity-100 visibility-visible transition-opacity duration-300 ease-in-out'
							: 'opacity-0 visibility-hidden transition-opacity duration-300 ease-in-out'
					}`}
				>
					Change cover
				</span>
			</DialogTrigger>
			<DialogContent>
				<Tabs defaultValue="neutral" className="w-[400px]">
					<TabsList>
						<TabsTrigger value="neutral">Neutral</TabsTrigger>
						<TabsTrigger value="unsplash">Unsplash</TabsTrigger>
					</TabsList>
					<TabsContent value="neutral">
						Make changes to your account here.
					</TabsContent>
					<TabsContent
						value="unsplash"
						className="w-[29rem] overflow-y-scroll md:overflow-y-auto max-h-72"
					>
						<div className="relative mt-1">
							<input
								className="w-full py-2 pl-10 pr-10 text-gray-600 text-sm bg-white border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
								placeholder="Search for an image..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<Search />
							</span>
						</div>
						{isErrorRandom || isErrorSearch ? (
							<div className="flex justify-center my-24">
								<span className="text-gray-700">
									Something went wrong.
								</span>
							</div>
						) : isLoadingRandom || isFetching ? (
							<div className="flex justify-center my-24">
								<LoadingCircle className="fill-gray-500 text-gray-300" />
							</div>
						) : query ? (
							<div className="grid grid-cols-3 gap-3 mt-4">
								{dataSearch?.map(
									({ id, alt, urls, user }: ImageData) => (
										<div key={id}>
											<Image
												id={id}
												alt={alt || 'random image'}
												src={urls.small}
												width={200}
												height={50}
												className="w-full h-16 rounded-sm object-cover"
											/>
											<div className="text-xs text-muted-foreground mt-1">
												<span>by </span>
												<Link
													id={user.id}
													href={user.links.html}
													className="underline hover:text-red-500"
												>
													{user.username}
												</Link>
											</div>
										</div>
									)
								)}
							</div>
						) : (
							<div className="grid grid-cols-3 gap-3 mt-4">
								{dataRandom?.map(
									({ id, alt, urls, user }: ImageData) => (
										<div key={id}>
											<Image
												id={id}
												alt={alt || 'random image'}
												src={urls.small}
												width={200}
												height={50}
												className="w-full h-16 rounded-sm object-cover"
											/>
											<div className="text-xs text-muted-foreground mt-1">
												<span>by </span>
												<Link
													id={user.id}
													href={user.links.html}
													className="underline hover:text-red-500"
												>
													{user.username}
												</Link>
											</div>
										</div>
									)
								)}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
