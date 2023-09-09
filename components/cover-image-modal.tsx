'use client'

import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { ImageData } from '@/app/types'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoadingCircle, Search } from '@/components/ui/icons'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CoverImageModal({
	isHovered,
	coverImage,
	setCoverImage,
	triggerButton
}: {
	isHovered?: boolean
	coverImage: { type: 'color' | 'image'; bg: string }
	setCoverImage: (value: { type: 'color' | 'image'; bg: string }) => void
	triggerButton: React.ReactNode
}) {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (coverImage.bg) {
			setOpen(false)
		}
	}, [coverImage])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent>
				<Tabs defaultValue="colors" className="w-[400px]">
					<TabsList>
						<TabsTrigger value="colors">Colors</TabsTrigger>
						<TabsTrigger value="unsplash">Unsplash</TabsTrigger>
					</TabsList>
					<TabsContent
						value="colors"
						className="w-[29rem] overflow-y-scroll md:overflow-y-auto max-h-[232px]"
					>
						<ColorsTabContent setCoverImage={setCoverImage} />
					</TabsContent>
					<TabsContent
						value="unsplash"
						className="w-[29rem] overflow-y-scroll md:overflow-y-auto max-h-[232px]"
					>
						<UnsplashTabContent setCoverImage={setCoverImage} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

function ColorsTabContent({
	setCoverImage
}: {
	setCoverImage: (value: { type: 'color' | 'image'; bg: string }) => void
}) {
	const colors = [
		{ color: '#0077b6', name: 'Blue' },
		{ color: '#00b4d8', name: 'Turquoise' },
		{ color: '#9d4edd', name: 'Violet' },
		{ color: '#ef233c', name: 'Red' },
		{ color: '#ffafcc', name: 'Pink' },
		{ color: '#ffd500', name: 'Yellow' },
		{ color: '#f4f1de', name: 'Beige' },
		{ color: '#adb5bd', name: 'Gray' },
		{ color: '#0a0a0a', name: 'Black' }
	]

	return (
		<div className="grid grid-cols-3 gap-3 mt-4">
			{colors.map(({ color, name }, i) => (
				<div
					key={i}
					className="h-16 rounded-sm cursor-pointer"
					style={{ backgroundColor: color }}
					title={name}
					onClick={() =>
						setCoverImage({
							type: 'color',
							bg: color
						})
					}
				></div>
			))}
		</div>
	)
}

function UnsplashTabContent({
	setCoverImage
}: {
	setCoverImage: (value: { type: 'color' | 'image'; bg: string }) => void
}) {
	const [query, setQuery] = useState('')

	const {
		isLoading: isLoadingRandom,
		isError: isErrorRandom,
		data: dataRandom
	} = useQuery(['randomImages'], async () => {
		try {
			const randomImages = await axios.get(
				`https://api.unsplash.com/photos/?per_page=20&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
			)
			const randomImage: ImageData[] = randomImages.data
			return randomImage
		} catch (e) {
			throw new Error(
				'Error loading random images: ' + (e as Error).message
			)
		}
	})

	const {
		isFetching,
		isError: isErrorSearch,
		data: dataSearch
	} = useQuery(['searchImages', query], async () => {
		try {
			if (!query) return []
			const searchImages = await axios.get(
				`https://api.unsplash.com/search/photos?page=1&query=${query}&per_page=20&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
			)
			const searchImage: ImageData[] = await searchImages.data.results
			return searchImage
		} catch (e) {
			throw new Error('Error searching images: ' + (e as Error).message)
		}
	})

	return (
		<>
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
					<span className="text-gray-700">No results found.</span>
				</div>
			) : isLoadingRandom || isFetching ? (
				<div className="flex justify-center my-24">
					<LoadingCircle className="fill-gray-500 text-gray-300" />
				</div>
			) : query ? (
				<div className="grid grid-cols-3 gap-3 mt-4">
					{dataSearch?.map(({ id, alt, urls, user }: ImageData) => (
						<div key={id}>
							<Image
								id={id}
								alt={alt || `${query} image`}
								src={urls.small}
								width={200}
								height={50}
								className="w-full h-16 rounded-sm object-cover cursor-pointer"
								onClick={() => {
									setCoverImage({
										type: 'image',
										bg: urls.small
									})
								}}
							/>
							<div className="text-xs text-muted-foreground mt-1">
								<span>by </span>
								<Link
									id={user.id}
									href={user.links.html}
									target="_blank"
									className="underline hover:text-red-500"
								>
									{user.username}
								</Link>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-3 gap-3 mt-4">
					{dataRandom?.map(({ id, alt, urls, user }: ImageData) => (
						<div key={id}>
							<Image
								id={id}
								alt={alt || 'random image'}
								src={urls.small}
								width={200}
								height={50}
								className="w-full h-16 rounded-sm object-cover cursor-pointer"
								onClick={() =>
									setCoverImage({
										type: 'image',
										bg: urls.small
									})
								}
							/>
							<div className="text-xs text-muted-foreground mt-1">
								<span>by </span>
								<Link
									id={user.id}
									href={user.links.html}
									target="_blank"
									className="underline hover:text-red-500"
								>
									{user.username}
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	)
}
