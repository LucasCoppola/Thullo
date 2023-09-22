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
		labels.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

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

export async function updateLabel({
	cardId,
	labelId,
	name,
	color
}: {
	cardId: string
	labelId: string
	name: string
	color: ColorProps
}) {
	try {
		const existingLabel = await prisma.label.findUnique({
			where: {
				cardId,
				id: labelId
			}
		})

		if (!existingLabel) {
			throw new Error('Label not found')
		}

		const updatedLabelData = {} as Label & { color: ColorProps }

		if (existingLabel.color !== color) {
			updatedLabelData.color = color
		}

		if (existingLabel.name !== name) {
			updatedLabelData.name = name
		}

		// no changes needed
		if (Object.keys(updatedLabelData).length === 0) {
			return existingLabel
		}

		const updatedLabel = await prisma.label.update({
			where: {
				cardId,
				id: labelId
			},
			data: {
				name,
				color
			}
		})

		return updatedLabel
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}

export async function deleteLabel({
	cardId,
	labelId
}: {
	cardId: string
	labelId: string
}) {
	try {
		await prisma.label.delete({
			where: {
				cardId,
				id: labelId
			}
		})
	} catch (e) {
		console.error(e)
		throw (e as Error).message
	}
}
