'use server'

import prisma from '@/lib/prisma'
import type { ColorProps } from '@/app/types'
import type { Label } from '@prisma/client'

export async function getLabels({ cardId }: { cardId: string }) {
	try {
		const labels = await prisma.label.findMany({
			where: {
				cardId
			}
		})

		return { labels }
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function createLabel({
	cardId,
	color,
	name
}: Omit<Label, 'id'> & { color: ColorProps }) {
	try {
		const label = await prisma.label.create({
			data: {
				cardId,
				color,
				name
			}
		})

		return label
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
