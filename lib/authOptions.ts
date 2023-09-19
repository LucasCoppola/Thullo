import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/lib/prisma'

declare module 'next-auth' {
	interface Session {
		userId: string
	}
}

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		})
	],
	callbacks: {
		async session({ session, user }) {
			session.userId = user.id
			return Promise.resolve(session)
		}
	},
	secret: process.env.NEXTAUTH_SECRET as string
}
