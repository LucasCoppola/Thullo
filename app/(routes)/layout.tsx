import Nav from '@/components/shared/nav'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<Nav />
				<div className="mx-32">{children}</div>
			</body>
		</html>
	)
}
