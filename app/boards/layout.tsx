import Nav from '@/components/nav'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'

const poppins = Poppins({
	weight: ['400', '500'],
	subsets: ['latin'],
	display: 'swap'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<Nav />
				{children}
				<Toaster richColors closeButton />
			</body>
		</html>
	)
}
