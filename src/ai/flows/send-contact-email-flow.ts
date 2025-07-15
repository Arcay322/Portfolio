'use server';

/**
 * @fileOverview A server action to handle sending a contact email using Resend.
 *
 * - sendContactEmail - A function that sends an email from the contact form.
 */
import { Resend } from 'resend';
import { SendContactEmailInputSchema } from '@/ai/schemas/contact-email';
import type { z } from 'zod';

export type SendContactEmailInput = z.infer<typeof SendContactEmailInputSchema>;

export async function sendContactEmail(input: SendContactEmailInput) {
  const validatedInput = SendContactEmailInputSchema.parse(input);
  
  // Use the API key from environment variables.
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL_ADDRESS;

  if (!apiKey || !toEmail) {
    throw new Error("Missing server configuration. Email was not sent.");
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: toEmail,
      subject: `New message from ${validatedInput.name} via your portfolio`,
      reply_to: validatedInput.email,
      html: `<p><strong>Name:</strong> ${validatedInput.name}</p>
             <p><strong>Email:</strong> ${validatedInput.email}</p>
             <p><strong>Message:</strong></p>
             <p>${validatedInput.message}</p>`,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send email with Resend:', error);
    if (error instanceof Error) {
      // If the error is the specific "API key is invalid" error, customize the message.
      if (error.message.includes("API key is invalid")) {
        throw new Error("API key is invalid");
      }
      throw error;
    }
    throw new Error('An unknown error occurred while sending the email.');
  }
}
