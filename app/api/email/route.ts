import GithubAccessTokenEmail from '@/emails/email'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
	try {
		const { username } = await req.json()
		const data = await resend.emails.send({
			from: 'notify@mail.thullo.so',
			to: 'lucascoppola21@gmail.com',
			subject: 'Hello World',
			react: GithubAccessTokenEmail({ username })
		})
		console.log(data)
		return NextResponse.json(data)
	} catch (error) {
		console.error(error)
		return NextResponse.json({
			status: 'Error',
			message: (error as Error).message
		})
	}
}
