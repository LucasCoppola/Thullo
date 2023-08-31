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
		return { e }
	}
}

export async function findUsers({
	keyword,
	currUserId
}: {
	keyword: string
	currUserId: string
}) {
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [{ email: keyword }, { name: keyword }],
				AND: { id: { not: currUserId } }
			},
			select: { id: true, name: true, image: true }
		})

		return { users }
	} catch (e) {
		console.error(e)
		return { e }
	}
}