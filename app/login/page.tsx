'use client'

import { Button } from '@/components/ui/button'
import { Google, LoadingCircle } from '@/components/ui/icons'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
	const [clickedGoogle, setClickedGoogle] = useState(false)
	return (
		<div className="flex h-screen w-screen justify-center bg-slate-50">
			<div className="z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
				<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
					<h3 className="text-xl font-semibold">Sign in</h3>
					<p className="text-sm text-gray-500">
						This is strictly for demo purposes - only your email and
						profile picture will be stored.
					</p>
				</div>
				<div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
					<Button
						onClick={() => {
							setClickedGoogle(true)
							signIn('google')
						}}
					>
						{clickedGoogle ? (
							<LoadingCircle className="h-4 w-4" />
						) : (
							<>
								<Google className="h-4 w-4 mr-2" />
								Continue with Google
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}
