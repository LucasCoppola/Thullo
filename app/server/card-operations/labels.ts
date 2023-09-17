'use server'

import type { ColorProps } from '@/app/types'
import prisma from '@/lib/prisma'
import type { Label } from '@prisma/client'

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
