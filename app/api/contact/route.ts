export const runtime = "edge";

export const runtime = "edge";

import { NextResponse } from 'next/server';
import { sanitizeText, sanitizeEmail, sanitizeAttribute } from '@/lib/api/sanitize';
import { contactFormSchema } from '@/lib/api/validation';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate with Zod schema
        const validationResult = contactFormSchema.safeParse(body);
        if (!validationResult.success) {
            const firstError = validationResult.error.errors[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            );
        }

        // Sanitize validated data
        const { name, email, message } = validationResult.data;
        const sanitizedName = sanitizeText(name);
        const sanitizedEmail = sanitizeEmail(email);
        const sanitizedMessage = sanitizeText(message);

        // Send email via Resend (if configured)
        const resendApiKey = process.env.RESEND_API_KEY;
        const contactEmail = process.env.CONTACT_EMAIL || 'contact@scrolli.co';

        if (resendApiKey) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'Scrolli Contact Form <noreply@scrolli.co>', // Update with your verified domain
                        to: contactEmail,
                        replyTo: sanitizedEmail,
                        subject: `Yeni İletişim Formu Mesajı: ${sanitizeAttribute(sanitizedName)}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #16a34a;">Yeni İletişim Formu Mesajı</h2>
                                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>İsim:</strong> ${sanitizedName}</p>
                                    <p><strong>E-posta:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
                                    <p><strong>Mesaj:</strong></p>
                                    <p style="white-space: pre-wrap; margin-top: 10px;">${sanitizedMessage}</p>
                                </div>
                                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                                    Bu mesaj Scrolli iletişim formundan gönderilmiştir.
                                </p>
                            </div>
                        `,
                        text: `
Yeni İletişim Formu Mesajı

İsim: ${sanitizedName}
E-posta: ${sanitizedEmail}

Mesaj:
${sanitizedMessage}
                        `.trim(),
                    }),
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error('Failed to send contact email:', errorData);
                    // Still return success to user, but log the error
                }
            } catch (emailError) {
                console.error('Error sending contact email:', emailError);
                // Still return success to user, but log the error
            }
        } else {
            // If Resend is not configured, log the contact for manual follow-up
            console.log('Contact form submission (Resend not configured):', {
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage,
            });
        }

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