import { Session } from 'next-auth'
import UserDropdown from './user-dropdown'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function Navbar({ session }: { session: Session | null }) {
	return (
		<nav className="relative bg-white mt-2">
			<div className="container py-3 md:flex md:justify-between items-center">
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
									<svg
										className="w-5 h-5 text-gray-400"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
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
