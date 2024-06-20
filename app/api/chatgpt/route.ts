import { NextResponse } from "next/server"
import OpenAI from "openai";

const openai = new OpenAI();

export const POST = async (request: Request) => {
    const { question } = await request.json()

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a knowlegeable assistant that provide quality information.'
                },
                {
                    role: 'user',
                    content: `Tell me ${question}`
                }
            ]
        })

        const reply = response.choices[0].message.content

        return NextResponse.json({ reply })
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}