import Nav from '@/components/shared/nav'
import Link from 'next/link'

export default function Home() {
	return (
		<>
			<Nav />
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				<Link href="/boards" className="link">
					Boards
				</Link>
			</main>
		</>
	)
}
