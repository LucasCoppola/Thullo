'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient()

export default function ReactQueryProvider({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</SessionProvider>
	)
}
