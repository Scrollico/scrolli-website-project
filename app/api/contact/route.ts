import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // TODO: Add your email sending logic here
        // Example: Send email using nodemailer or other email service

        // For now, we'll just simulate a successful response
        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
} 