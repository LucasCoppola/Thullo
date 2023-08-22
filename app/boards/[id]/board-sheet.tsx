import Image from 'next/image'
import { AuthorProps, BoardProps } from '@/app/server'
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
	authorId,
	author
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
					<SheetDescription>
						<span>Made by</span>
						<Image
							src={author?.image || ''}
							width={100}
							height={100}
							alt=""
						/>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
