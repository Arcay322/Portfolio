import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Newsletter subscription endpoint
// Replace with actual email service (Mailchimp, SendGrid, ConvertKit, etc.)

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// In-memory storage for demo (replace with database)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json(
        { error: 'Este email ya está suscrito' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual email service integration
    // Example with SendGrid:
    // await sendgrid.send({
    //   to: email,
    //   from: 'newsletter@yoursite.com',
    //   subject: 'Confirma tu suscripción',
    //   html: '<p>Click here to confirm...</p>',
    // });

    // Example with Mailchimp:
    // await mailchimp.lists.addListMember(LIST_ID, {
    //   email_address: email,
    //   status: 'pending',
    // });

    // Add to subscribers (demo only)
    subscribers.add(email);

    // Log the subscription
    console.log(`New subscriber: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Suscripción exitosa! Revisa tu email para confirmar.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    const { email: validEmail } = subscribeSchema.parse({ email });

    // Remove from subscribers
    subscribers.delete(validEmail);

    // TODO: Update email service

    return NextResponse.json(
      { success: true, message: 'Desuscripción exitosa' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la desuscripción' },
      { status: 500 }
    );
  }
}
