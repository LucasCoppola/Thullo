import Image from 'next/image'
import { AuthorProps, BoardProps } from '@/app/types'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { MoreHorizontal } from 'lucide-react'

export default function BoardSheet({
	title,
	author,
	createdAt
}: { author: AuthorProps } & BoardProps) {
	return (
		<Sheet>
			<SheetTrigger
				title="Show Menu"
				className="flex items-center justify-center w-8 h-7 rounded-md hover:bg-gray-200 transition duration-200"
			>
				<MoreHorizontal />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription asChild>
						<>
							<hr className="mb-2" />
							<span className="text-xs font-medium text-gray-500">
								Made by
							</span>
							<div className="flex flex-row items-center mt-3">
								<Image
									src={author?.image || ''}
									width={36}
									height={36}
									alt={`${author?.name} avatar`}
									className="rounded-lg mr-3"
								/>
								<div className="flex flex-col">
									<h1 className="font-semibold text-sm text-gray-800">
										{author?.name}
									</h1>
									<span className="text-xs font-medium text-gray-500">
										on {createdAt?.toDateString().slice(4)}
									</span>
								</div>
							</div>
						</>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
