import Image from 'next/image'
import Link from 'next/link'
import { CommandDialog, CommandInput } from '@/components/ui/command'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { findBoard } from '@/app/server/boardsOperations'
import { LoadingCircle } from './ui/icons'
import type { CoverImageType } from '@/app/types'
import { usePathname } from 'next/navigation'
import useWindowSize from '@/lib/hooks/useWindowSize'

export default function SearchBoardModal({ userId, boardId }: { userId: string; boardId: string }) {
	const pathname = usePathname()
	const [openSearchDialog, setOpenSearchDialog] = useState(false)
	const [keyword, setKeyword] = useState('')
	const { isMobile, isMid } = useWindowSize()
	const isBoardIdPage = pathname === `/boards/${boardId}`

	const { data: boards, isLoading } = useQuery(
		['search-board', keyword],
		async () => await findBoard({ keyword, userId })
	)

	return (
		<>
			{(isMobile && isBoardIdPage) || (isMid && isBoardIdPage) ? (
				<div
					className="flex items-center mr-3 border rounded-md px-1.5"
					onClick={() => setOpenSearchDialog(true)}
				>
					<Search className="w-5 h-5 text-gray-500" />
				</div>
			) : (
				<div className="relative mr-10 md:mr-20 flex" onClick={() => setOpenSearchDialog(true)}>
					<input
						type="button"
						className="w-40 md:w-64 pl-9 py-2 text-gray-500 text-sm bg-white border border-gray-300 rounded-lg text-left"
						value="Search..."
					/>
					<span className="absolute inset-y-0 left-0 flex items-center pl-3">
						<Search className="w-4 h-4 text-gray-500" />
					</span>
				</div>
			)}
			<CommandDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
				<>
					<CommandInput
						placeholder="Type the board name..."
						value={keyword}
						onValueChange={(search) => setKeyword(search)}
					/>

					<ul className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-1 space-y-0.5">
						{isLoading ? (
							<div className="flex justify-center ">
								<LoadingCircle className="fill-gray-500 text-gray-300 my-6" />
							</div>
						) : boards && boards.length > 0 ? (
							boards?.map((board) => {
								const coverImage = board.coverImage as CoverImageType

								return (
									<li
										key={board.id}
										className="py-1 select-none rounded-sm px-2 text-sm outline-none hover-bg-gray-100"
									>
										<Link
											href={`/boards/${board.id}`}
											className="flex items-center"
											onClick={() => setOpenSearchDialog(false)}
										>
											{coverImage?.type === 'image' ? (
												<Image
													className="h-8 w-8 rounded-md mr-2 object-center object-cover"
													src={coverImage?.bg || ''}
													alt="board cover image"
													width={400}
													height={400}
												/>
											) : (
												<div
													className="h-8 w-8 rounded-md mr-2"
													style={{
														backgroundColor: coverImage?.bg
													}}
												></div>
											)}
											<div>
												<h3 className="text-sm">{board.title}</h3>
												<p className="text-xs text-gray-600">
													{board.visibility[0]?.concat(
														board.visibility.slice(1).toLowerCase()
													)}
												</p>
											</div>
										</Link>
									</li>
								)
							})
						) : (
							<p className="py-6 text-center text-sm">No results found.</p>
						)}
					</ul>
				</>
			</CommandDialog>
		</>
	)
}
