import { Session } from 'next-auth'
import UserDropdown from './user-dropdown'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Search } from '../ui/icons'

export default function Navbar({ session }: { session: Session | null }) {
	return (
		<nav className="relative bg-white mt-2 px-10 shadow-sm">
			<div className="w-full py-3 md:flex md:justify-between items-center">
				<div className="flex items-center">
					<a href="#">
						<Image
							className="w-auto h-6 sm:h-7"
							src="./Logo.svg"
							alt="Logo"
							width={400}
							height={400}
						/>
					</a>
				</div>

				<div className="flex">
					{session ? (
						<>
							<div className="relative mr-20">
								<input
									type="text"
									className="w-full py-2 pl-10 pr-10 text-gray-600 text-sm bg-white border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
									placeholder="Search..."
								/>
								<span className="absolute inset-y-0 left-0 flex items-center pl-3">
									<Search />
								</span>
							</div>
							<UserDropdown session={session} />
						</>
					) : (
						<Link href="/login">
							<Button className="rounded-lg">Sign In</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}
