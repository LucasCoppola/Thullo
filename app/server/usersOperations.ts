'use server'

import prisma from '@/lib/prisma'

export async function findUserById({ id }: { id: string }) {
	try {
		const author = await prisma.user.findUnique({
			where: {
				id
			},
			select: { id: true, name: true, image: true }
		})

		return { author }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function findUsers({ keyword, currUserId }: { keyword: string; currUserId: string }) {
	try {
		const users = await prisma.user.findMany({
			where: {
				name: { startsWith: keyword, mode: 'insensitive' },
				OR: [{ email: { startsWith: keyword, mode: 'insensitive' } }],
				AND: { id: { not: currUserId } }
			},
			select: { id: true, name: true, image: true }
		})

		return users
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
